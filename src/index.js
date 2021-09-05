document.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector('#new-quote-form');
    let quoteList = document.querySelector('#quote-list');
    
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(json => {
        console.log(json)
        json.forEach(quote => {
            quoteList.appendChild(makeCard(quote))
        })

        let likeBtns = document.querySelectorAll('button.btn-success');
        let deleteBtns = document.querySelectorAll('button.btn-danger');

        likeBtns.forEach(button => {
            button.addEventListener('click', e => {
                // console.log(e)
                let likeTime = new Date()
                let configObj = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        quoteId: e.target.parentNode.parentNode.quoteData,
                        createdAt: likeTime.getTime()
                    })
                }

                fetch(`http://localhost:3000/likes`, configObj)
                .then(resp => resp.json())
                .then(json => {
                    let oldLikes = parseInt(e.target.innerText.slice(-1));
                    e.target.innerHTML = `Likes: <span>${oldLikes + 1}</span>`
                })
            })
        })
    })

    form.addEventListener('submit', e => {
        e.preventDefault();
        console.log(e)
        let configObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quote: e.target[0].value,
                author: e.target[1].value
            })
        }

        fetch('http://localhost:3000/quotes', configObj)
        .then(resp => resp.json())
        .then(json => quoteList.appendChild(makeCard(json)));
        // let cardObj = {};
        // cardObj.quote = e.target[0].value;
        // cardObj.author = e.target[1].value;
        // quoteList.appendChild(makeCard(cardObj))

    })
});

function makeCard(obj){
    let li = document.createElement('li');
    li.className = 'quote-card';
    li.quoteData = obj.id;

    let blockQuote = document.createElement('blockquote');
    blockQuote.className = 'blockquote';

    let p = document.createElement('p');
    p.className = 'mb-0';
    p.innerText = obj.quote;
    blockQuote.appendChild(p);

    let footer = document.createElement('footer');
    footer.className = 'blockquote-footer';
    footer.textContent = obj.author;
    blockQuote.appendChild(footer);

    let br = document.createElement('br');
    blockQuote.appendChild(br);

    let likeBtn = document.createElement('button');
    likeBtn.className = 'btn-success'
    likeBtn.innerHTML = `Likes: <span>${obj.likes.length}</span>`;
    blockQuote.appendChild(likeBtn);

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-danger'
    deleteBtn.innerText = 'Delete';
    blockQuote.appendChild(deleteBtn);

    li.appendChild(blockQuote);

    return li;


}