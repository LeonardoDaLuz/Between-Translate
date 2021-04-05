window.onkeydown = (e) => {
    if (e.key == "'") {
        traduzir();
    }
}
var ps = null;
var pels = null;
var hs = null;
var hels = null;

function traduzir() {
    console.log("traduzir");
    console.log(ps);
    if (ps === null) {
        createStyles();
        createPElements();
        createHElements();
        traduzirElementos(pels);
    } else {
        console.log("kghj");
        [...ps].forEach(e=> {
            e.classList.toggle("origin");
        })

        pels.forEach(e=> {
            e.classList.toggle('display-none'); 
        })
    }

}

function createPElements() {
    ps = document.querySelectorAll("p");
    pels = [...ps].map(p => {
        let el = document.createElement("span");

        el.classList.add("trad");
        p.classList.add("origin");
        el.innerHTML = p.innerHTML.replaceAll('"', "'").replaceAll(/\n/g, "32594");
        p.prepend(el);
        return el;
    })
}

function createHElements() {
    hs = document.querySelectorAll("h1, h2");
    hels = [...hs].map(h => {
        let el = document.createElement("span");

        el.classList.add("trad");
        h.classList.add("origin");
        el.innerHTML = h.innerHTML.replaceAll('"', "'").replaceAll(/\n/g, "32594");
        h.prepend(el);
        return el;
    })
}
function createStyles() {
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
            line-height: 2em!important;  
            position: relative;
        }
        .trad * {
            color: blue!important;

        }
        .display-none {
            display: none;
        }
    `;
}

function traduzirElementos(els) {
    let elementsTexts = els.map(el => el.textContent);
    console.log(elementsTexts);
    let specialChar = "987456"
    let arrTratado = JSON.stringify(elementsTexts).replaceAll('"', specialChar);
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
            let fontSize = (els[i].innerHTML.length / retornoParseado[i].length) * 0.95;
            fontSize = fontSize > 1 ? 1 : fontSize;

            els[i].style = " font-size: " + fontSize + "em;";
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
            alert("it was not possible to do the translation");
            throw new Error("it was not possible to do the translation");
        });
}