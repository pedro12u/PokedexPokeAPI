const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const pokemonRoutes = require("./routes/pokemon");
const helpers = require("handlebars-helpers")();
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const hbs = exphbs.create({
  defaultLayout: "main",
  helpers: {
    ...helpers,
    getPokemonId: (url) => {
      const parts = url.split("/");
      return parts[parts.length - 2];
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/pokemon", pokemonRoutes);

app.get("/", (req, res) => {
  res.render("home", { title: "Pokémon API" });
});

app.use((req, res, next) => {
  res.status(404).render("error", { message: "Página não encontrada!" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Erro interno no servidor!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
