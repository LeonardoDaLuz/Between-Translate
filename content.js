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
var allTranslateElements = [];

function traduzir() {
    if (ps === null) {
        createStyles();
        createPElements();
        createHElements();
        clearEmptyElements();
        traduzirElementos(allTranslateElements);
    } else {
        toggle();
    }

}

function clearEmptyElements() {

    allElements.forEach(x=> {
        if(x.textContent===""){
            console.log("Epa vazio ");
            console.log(x);
        }
    })
    allTranslateElements = allTranslateElements.filter(x => (x.textContent !== "" && x.textContent !== " "));
    allElements = allElements.filter(x => (x.textContent !== "" && x.textContent !== " "));
}

function toggle() {
    allElements.forEach(e => {
        e.classList.toggle("origin-language");
    })

    allTranslateElements.forEach(e => {
        e.classList.toggle('display-none');
    })
}

function createPElements() {
    ps = document.querySelectorAll("p");
    tradPs = [...ps].map(p => {
        let tradP = document.createElement("span");
        tradP.classList.add("target-language");
        p.classList.add("origin-language");
        tradP.innerHTML = escapa(p.textContent);
        p.prepend(tradP);
        return tradP;
    });

    allElements = allElements.concat([...ps]);
    allTranslateElements = allTranslateElements.concat(tradPs);
}

function createHElements() {
    hs = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    tradHs = [...hs].map(h => {
        let tradH = document.createElement("span");

        tradH.classList.add("target-language");
        h.classList.add("origin-language");
        tradH.innerHTML = escapa(h.textContent);
        h.append(tradH);
        return tradH;
    })

    allElements = allElements.concat([...hs]);
    allTranslateElements = allTranslateElements.concat(tradHs);
}

function escapa(txt) {
    return txt.replaceAll('"', "'").replaceAll(/”|“|\[|\]/gi, '').replaceAll('&', "and").replaceAll(/\n/g, "32594").replace(/[`~!@#$%^&*()_|<>\{\}\[\]\\\/]/gi, '');

}

function desescapa(txt) {
    return txt.replaceAll("32594", /\n/g);
}

function createStyles() {
    let style = document.createElement("style");
    document.body.prepend(style);
    style.innerHTML =
        `
        .target-language {
            position: absolute;
            color: blue;
            top: 1em;
            font-size: 0.856em;
            display: block;    
        }
        .origin-language {
            line-height: 2em!important;  
            position: relative;
            clear: both;
        }
        .target-language * {
            color: blue!important;
        }

        h6 .target-language {
            color: blue!important;
            position: static;
            line-height: 1em!important;  
        }

        h5 .target-language {
            color: blue!important;
            position: static;
            line-height: 1em!important;  
        }

        h4 .target-language {
            color: blue!important;
            position: static;
            line-height: 1em!important;  
        }

        h3 .target-language {
            color: blue!important;
            position: static;
            line-height: 1em!important;  
        }
        h2 .target-language {
            color: blue!important;
            position: static;
            line-height: 1em!important;  
        }
        h1 .target-language {
            color: blue!important;
            position: static;
            line-height: 1em!important;  
        }

        .display-none {
            display: none;
        }
    `;
}

function codificar(txt) {
    return txt.replaceAll('["', '[').replaceAll('","', '].[').replaceAll('"]', ']');
}

function decodificar(txt) {
    return txt.replaceAll('"')
        .replaceAll('] ]',']')
        .replaceAll('].[', '","').replaceAll(']. [', '","').replaceAll('] [', '","').replaceAll('] . [', '","').replaceAll('][', '","') //estruturas intactas mas com espaços
        .replaceAll('] ', '","').replaceAll(' [', '","').replaceAll(']. ', '","').replaceAll(' .[', '","') //estruturas onde o google comeu caracteres especiais
        .replaceAll(']', '"]').replaceAll('[', '["').replaceAll('"].', '"]'); //arruma o inicio e o fim da string json
}

function traduzirElementos(elementos) {
    let elementsTexts = elementos.map(el => el.textContent);
    console.log(elementsTexts);


    console.log("nao codificado: " + JSON.stringify(elementsTexts));
    let conteudoCodificado = codificar(JSON.stringify(elementsTexts));
    console.log("codificado: " + conteudoCodificado);
    console.log("decodificado: " + decodificar(conteudoCodificado));
    console.log("test parse:");
    console.log(JSON.parse(decodificar(conteudoCodificado)));

    tradTxt(conteudoCodificado, elementos, (data) => {

        console.log(data);
        let newData = data.map(item => item[0]).join('');

        console.log("retorno n tratado:");
        console.log(newData);
        console.log("retorno decodificado:");
        let retornoTratado = decodificar(newData);
        console.log(retornoTratado);
        console.log("retorno parse:");
        var retornoParseado = JSON.parse(retornoTratado);
        console.log(retornoParseado);

        //console.log(elementos);

        //console.log("elementos vindos: "+retornoParseado.length+" disponiveis: "+elementos.length)
        for (i = 0; i < elementos.length; i++) {

            if (retornoParseado.length > i) {

                let fontSize = (elementos[i].innerHTML.length / retornoParseado[i].length) * 1;
                fontSize = fontSize > 1 ? 1 : fontSize;

                elementos[i].style = " font-size: " + fontSize + "em;";
                elementos[i].innerHTML = desescapa(retornoParseado[i]);
            }

        }
    })
}

function tradTxt(txt, elementos, callback) {
    fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=' + txt).then(response => response.json())
        .then(data => {

            callback(data[0]);

        })
        .catch(error => {
            toggle();
            console.log(error);
        });
}