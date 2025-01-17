//console.log ("Rodando a lsita em JS")
let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './sons/efeitos_hit.wav'

const sprites = new Image();
sprites.src = 'Sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext ('2d')

function bate(passaro, chao){
    if(passaro.y + passaro.ajusteChao >= chao.y ){
        return true;
    }
    return false;
}

function criaPassaro(){
    const passaro = {
        spritex: 0,
        spritey: 0,
        altura: 33,
        largura: 24,
        x: 10,
        y: 70,
        telax: 25,
        telay: 20,
        ajusteChao: 27,
        velocidade: 0,
        gravidade: 0.25,
        pulo: 5,
    
        pula(){
            passaro.velocidade = - passaro.pulo;
        },
        atualiza(){
    
        if(bate(passaro, globais.chao)){    
            som_HIT.play();

            setTimeout(() => {
                mudaDeTela(Telas.inicio);

            }, 500)
            return; 
        }
            passaro.velocidade = passaro.velocidade + passaro.gravidade;
            passaro.y = passaro.y + passaro.velocidade;
        },
        movimentos: [
            {spritex: 0, spritey: 0,},
            {spritex: 0, spritey: 26,},
            {spritex: 0, spritey: 52,},
            {spritex: 0, spritey: 26,}
        ],
        frameAtual: 0,
        atualizaFrameAtual(){
            const intervaloDeFrames = 10;
            const passouIntervalo = frames % intervaloDeFrames === 0;

         if(passouIntervalo){
            const inicioIncremento = 1;
            const incremento = inicioIncremento + passaro.frameAtual;
            const asaRepeticao = passaro.movimentos.length;
            passaro.frameAtual = incremento % asaRepeticao;
            }
                
            },

        desenha(){
            passaro.atualizaFrameAtual();
            const{ spritex, spritey } = passaro.movimentos[passaro.frameAtual];
            ctx.drawImage (sprites, 
                spritex, spritey, 
                passaro.altura, passaro.largura, 
                passaro.x, passaro.y, 
                passaro.telax, passaro.telay)
            
        }
    }
return passaro;
}

function criaChao(){
    const chao = {
        spritex: 0,
        spritey: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza(){
            const movimentoDoChao = 1;
            const repeteChao = chao.largura / 2;
            const movimentaChao = chao.x - movimentoDoChao;
            
            chao.x = movimentaChao % repeteChao;
        
        },   
        desenha(){
            ctx.drawImage(sprites, 
                chao.spritex, chao.spritey, 
                chao.largura, chao.altura, 
                chao.x, chao.y,
                chao.largura, chao.altura);
    
            ctx.drawImage(sprites, 
                chao.spritex, chao.spritey, 
                chao.largura, chao.altura, 
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura);
        }
    }
return chao;
}

function criaCano(){
    const canos ={
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu:{
            spriteX: 52,
            spriteY: 169,
        },
        espaço: 80,
        desenha(){            
            canos.pares.forEach(function(par){
                const espacamentoEntreCanos= 90;
                const yRandom= par.y;
                
                const canoCeuX= par.x;
                const canoCeuY= yRandom;
                ctx.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )
    
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                ctx.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                }
            })          
        },
        bateNoPassaro(par) {
            const cabecaDoPassaro = globais.passaro.y;
            const peDoPassaro = globais.passaro.y + globais.passaro.altura;

             if(globais.passaro.x >= par.x){
                if(cabecaDoPassaro <= par.canoCeu.y){
                    return true;
                }
                if(peDoPassaro >= par.canoChao.y){
                    return true;
                }
             }
                
            return false;
        },
        pares:[],

        atualiza(){
            const passou100Frames = frames % 100 === 0
            if(passou100Frames){
                canos.pares.push({
                        x: canvas.width,
                        y: -150 * (Math.random() + 1),
                    }
                )
            }
            canos.pares.forEach(function(par){
                par.x = par.x - 2;
                if(canos.bateNoPassaro(par)){
                    mudaDeTela(Telas.inicio);
                }
                if(par.x + canos.largura <= 0){
                    canos.pares.shift();
                }
            })
        }
    }
    return canos;
}

const planoDeFundo ={
    spritex: 390,
    spritey: 0,
    largura: 275,
    altura: 204,
    x:-1,
    y: canvas.height - 204,

    desenha(){
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect (0,0, canvas.width, canvas.height);
        ctx.drawImage(
            sprites,
            planoDeFundo.spritex, planoDeFundo.spritey, 
            planoDeFundo.largura, planoDeFundo.altura, 
            planoDeFundo.x, planoDeFundo.y, 
            planoDeFundo.largura, planoDeFundo.altura
        );
        
        ctx.drawImage(
            sprites,
            planoDeFundo.spritex, planoDeFundo.spritey, 
            planoDeFundo.largura, planoDeFundo.altura, 
            planoDeFundo.x + planoDeFundo.largura, planoDeFundo.y, 
            planoDeFundo.largura, planoDeFundo.altura
        )
    }
}

const mensagemComeço ={
    spritex: 133,
    spritey: 0,
    altura:176,
    largura: 152,
    x: 75,
    y: 100,

    desenha(){
        ctx.drawImage(sprites, 
            mensagemComeço.spritex, mensagemComeço.spritey,
            mensagemComeço.altura, mensagemComeço.largura,
            mensagemComeço.x, mensagemComeço.y, mensagemComeço.altura, mensagemComeço.largura)
    }
}

const globais = {};
let telaAtiva = {};
function mudaDeTela(novaTela){
   telaAtiva = novaTela;

   if(telaAtiva.inicializa){
       telaAtiva.inicializa();
   }
}
const Telas = {
    inicio: {
        inicializa(){
            globais.passaro = criaPassaro();
            globais.chao = criaChao();
            globais.canos = criaCano();
        },
        desenha(){
            planoDeFundo.desenha();
            globais.passaro.desenha();
            mensagemComeço.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
        },
        atualiza(){
            globais.chao.atualiza();
        },
        click(){
            mudaDeTela(Telas.jogo)
        }
    }
};

Telas.jogo = {
    desenha(){
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.passaro.desenha();
    },

    click(){
        globais.passaro.pula();
    },
    atualiza(){
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.passaro.atualiza();
    }
}

function loop (){

    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(telaAtiva.click()){
        mudaDeTela(Telas.jogo)
    }
})

mudaDeTela(Telas.inicio);
loop();
