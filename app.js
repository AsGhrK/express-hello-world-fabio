const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.type("html").send(html));

app.get("/req", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

// Desafio 1
app.get("/meunome", (req, res) => {
  res.send("Meu nome é Davi Casari da Silva");
});

// Desafio 2
app.get("/tico", (req, res) => {
  res.send("teco");
});

// Desafio 3 — ordem de captura (Butterfree é evolução do Caterpie, não captura)
app.get("/pokemons", (req, res) => {
  const pokemons = [
    "Pikachu",
    "Caterpie",
    "Pidgeotto",
    "Bulbasaur",
    "Charmander",
    "Squirtle",
    "Krabby",
    "Primeape",
    "Muk",
    "Tauros",
  ];
  res.json(pokemons);
});

// Desafio 4
app.post("/series", (req, res) => {
  const series = ["Breaking Bad", "Stranger Things", "The Witcher"];
  res.json(series);
});

// Desafio 5 — bug simulado: acessar propriedade de algo que não existe
app.get("/bug", (req, res) => {
  const usuario = undefined; // imagine um findById que não achou nada
  res.send(`Olá, ${usuario.nome}`); // TypeError -> Express responde 500
});

// Desafio 6 — consome a PokéAPI (pública, gratuita, sem chave)
app.get("/pokeapi/:nome", async (req, res) => {
  const nome = req.params.nome.toLowerCase();
  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`, {
      signal: AbortSignal.timeout(5000), // não deixa a requisição pendurada
    });

    if (resposta.status === 404) {
      return res.status(404).json({ erro: `Pokémon "${nome}" não encontrado` });
    }
    if (!resposta.ok) {
      return res.status(502).json({ erro: "Falha ao consultar a PokéAPI" });
    }

    const dados = await resposta.json();

    // Devolve só o que interessa, não o JSON gigante da API externa
    res.json({
      id: dados.id,
      nome: dados.name,
      tipos: dados.types.map((t) => t.type.name),
      altura_m: dados.height / 10,
      peso_kg: dados.weight / 10,
      imagem: dados.sprites.front_default,
    });
  } catch (erro) {
    console.error(erro);
    res.status(504).json({ erro: "PokéAPI indisponível ou lenta demais" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello Express API
    </section>
  </body>
</html>
`;