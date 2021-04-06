window.onkeydown = (e) => {
    if (e.key == "'") {
        traduzir();
    }
}
var ps = null;
var tradPs = null;
var hs = null;
var tradHs = null;
var allElements = [];
var allTradElements = [];

function traduzir() {
    console.log("traduzir");
    console.log(ps);
    if (ps === null) {
        createStyles();
        createPElements();
       // traduzirElementos(tradPs);
        createHElements();
        traduzirElementos(allTradElements);
    } else {
            toggle();
    }

}

function toggle() {
    [...ps].forEach(e=> {
        e.classList.toggle("origin");
    })

    tradPs.forEach(e=> {
        e.classList.toggle('display-none'); 
    })
}
function createPElements() {
    ps = document.querySelectorAll("p");
    tradPs = [...ps].map(p => {
        let tradP = document.createElement("span");
        tradP.classList.add("trad");
        p.classList.add("origin");
        tradP.innerHTML = escapa(p.textContent);
        p.prepend(tradP);
        return tradP;
    })

    allElements = allElements.concat([...ps]);
    allTradElements = allTradElements.concat(tradPs);
}

function createHElements() {
    hs = document.querySelectorAll("h1, h2");
    tradHs = [...hs].map(h => {
        let tradH = document.createElement("span");

        tradH.classList.add("trad");
        h.classList.add("origin");
        tradH.innerHTML = escapa(h.textContent);
        h.prepend(tradH);
        return tradH;
    })

    allElements = allElements.concat([...hs]);
    allTradElements = allTradElements.concat(tradHs);
}

function escapa(txt) {
    return txt.replaceAll('"', "'").replaceAll(/”|“|\[|\]/gi, '').replaceAll('&', "and").replaceAll(/\n/g, "32594");
 
    
}

function desescapa(txt) {
    return txt.replaceAll("32594", /\n/g);
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

function  codificar(txt) {
    return txt.replaceAll('["', '[').replaceAll('","', '].[').replaceAll('"]', ']');
}

function  decodificar(txt) {
    return txt.replaceAll('"')
    .replaceAll('].[', '","').replaceAll(']. [', '","').replaceAll('] [', '","').replaceAll('] . [', '","').replaceAll('][', '","') //estruturas intactas mas com espaços
    .replaceAll('] ', '","').replaceAll(' [', '","').replaceAll(']. ', '","').replaceAll(' .[', '","') //estruturas onde o google comeu caracteres especiais
    .replaceAll(']', '"]').replaceAll('[', '["').replaceAll('"].', '"]'); //arruma o inicio e o fim da string json
}

function traduzirElementos(elementos) {
    let elementsTexts = elementos.map(el => el.textContent);
    console.log(elementsTexts);
    let specialChar = '3278378';
    let specialCharVariation = '{ }';

    console.log("nao codificado: "+JSON.stringify(elementsTexts));
    let conteudoCodificado = codificar(JSON.stringify(elementsTexts));
    console.log("codificado: "+conteudoCodificado);
    console.log("decodificado: "+decodificar(conteudoCodificado));
    console.log("test parse:");
    console.log(JSON.parse(decodificar(conteudoCodificado)));

    tradTxt(conteudoCodificado, data => {

        let newData = data.map(item => item[0]).join('');

        console.log("retorno n tratado:");
        console.log(newData);
        console.log("retorno decodificado:");
        let retornoTratado = decodificar(newData);
        console.log(retornoTratado);
        console.log("retorno parse:");
        let retornoParseado = JSON.parse(retornoTratado);
        console.log(retornoParseado);

        console.log(elementos);
        for (i = 0; i < elementos.length; i++) {
            //console.log("s: "+els[i].innerHTML.length+" t: "+retornoParseado[i].length);
            //let comp= "s: "+els[i].innerHTML.length+" t: "+retornoParseado[i].length;
            let fontSize = (elementos[i].innerHTML.length / retornoParseado[i].length) * 0.95;
            fontSize = fontSize > 1 ? 1 : fontSize;

            elementos[i].style = " font-size: " + fontSize + "em;";
            elementos[i].innerHTML = desescapa(retornoParseado[i]);

            // els[i].innerHTML+=comp;
        }
    })
}

function tradTxt(txt, callback) {
    fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=' + txt).then(response => response.json())
        .then(data => {
            console.log(data);
            callback(data[0]);

        })
        .catch(error => {
            toggle();
            console.log(error);
        });
}