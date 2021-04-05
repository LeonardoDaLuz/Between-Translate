// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: traduzir,
    });
});

// The body of this function will be executed as a content script inside the
// current page


function traduzir() {
    /*chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });*/
    //document.body.style.backgroundColor = "red";
    let style = document.createElement("style");
    document.body.prepend(style);
    style.innerHTML =
        `
        .trad {
            position: absolute;
            color: blue;
            top: 1em;
            font-size: 0.856em;
            display: block;    
        }
        .origin {
            line-height: 2em;  
            position: relative;
        }
        .trad * {
            color: blue!important;

        }
    `;

    let ps = document.querySelectorAll("p");
    let els = [...ps].map(p => {
        let el = document.createElement("span");

        el.classList.add("trad");
        p.classList.add("origin");
        el.innerHTML = p.innerHTML.replaceAll('"', "'").replaceAll(/\n/g, "32594");
        p.prepend(el);
        return el;
    })

    traduzirElementos(els);

    function traduzirElementos(els) {
        let arr = els.map(el => el.textContent);
        console.log(arr);
        let specialChar = "987456"
        let arrTratado = JSON.stringify(arr).replaceAll('"', specialChar);
        console.log(arrTratado.replaceAll(specialChar, '"'));
        console.log("test parse:");
        console.log(JSON.parse(arrTratado.replaceAll(specialChar, '"')));

        tradTxt(arrTratado, data => {

            let newData = data.map(item => item[0]).join('');

            console.log("retorno n tratado:");
            console.log(newData);
            console.log("retorno tratado:");
            let retornoTratado = newData.replaceAll(specialChar, '"').replaceAll("32594", "\\n").replaceAll('"."', '","');
            console.log(retornoTratado);
            console.log("retorno parse:");
            let retornoParseado = JSON.parse(retornoTratado);
            console.log(retornoParseado);

            console.log(els);
            for (i = 0; i < els.length; i++) {
                //console.log("s: "+els[i].innerHTML.length+" t: "+retornoParseado[i].length);
                //let comp= "s: "+els[i].innerHTML.length+" t: "+retornoParseado[i].length;
                let fontSize = (els[i].innerHTML.length/retornoParseado[i].length)*0.95;
                fontSize=fontSize>1?1:fontSize;
                    
                els[i].style=" font-size: "+fontSize+"em;";
                els[i].innerHTML = retornoParseado[i];

               // els[i].innerHTML+=comp;


            }

        })
    }

    function tradTxt(txt, callback) {
        fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=' + txt).then(response => response.json())
            .then(data => {

                callback(data[0]);

            })
            .catch(error => {

            });
    }

}
