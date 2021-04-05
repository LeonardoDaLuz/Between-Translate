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

    console.log("foi2");

    let tst = [
        [
            ["père", "father", null, null, 1]
        ],
        null,
        "en"
    ];

    console.log(tst[0][0][0]);

    //document.body.style.backgroundColor = "red";
    let style = document.createElement("style");
    document.body.prepend(style);
    style.innerHTML =
        `
    .origin {
        position: relative;
        line-height: 2em;
    }
    .trad {
        position: absolute;
        top: 1em;
        color: blue!important;
    }
    .trad * {
        color: blue!important;
    }
    `;
    let ps = document.querySelectorAll("p");
    let els = [...ps].map(p => {
        let el = document.createElement("p");

        el.classList.add("trad");
        p.classList.add("origin");
        el.innerHTML = p.innerHTML;
        p.prepend(el);
        return el;
    })

    traduzirElementos(els);

    function traduzirElementos(els) {
        let arr = els.map(el => el.textContent);
        console.log(JSON.stringify(arr));

        tradTxt(JSON.stringify(arr), data => {
            for (i = 0; i < arr.length; i++) {
                var dataParsed= JSON.parse(data[0][0][0]);
                els[i].innerHTML = dataParsed[i];
            }
        })
    }

    function tradTxt(txt, callback) {
        fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=' + txt).then(response => response.json())
            .then(data => {
                console.log(data[0]);
            })
            .catch(error => {

            });
    }

}
