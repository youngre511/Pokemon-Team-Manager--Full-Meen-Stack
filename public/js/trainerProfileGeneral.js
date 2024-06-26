document.addEventListener("DOMContentLoaded", () => {
    const trainerUsername = document.querySelector(".profile").id;
    const pokemonInspectorContent = document.querySelector(
        ".pokemon-inspector-details"
    );
    const pokemonInspector = document.querySelector(".pokemon-inspector");
    const closeInspect = document.querySelector("#close-inspector");
    const speciesInfo = document.querySelector(".species-info");
    const speciesInfoBtn = document.querySelector("#species-info-btn");
    const infoBtns = document.querySelectorAll(".info-btn");

    // Set axios to send cookies along with the requests
    axios.defaults.withCredentials = true;

    /////////////////////////////
    ///// POKEMON INSPECTOR /////
    /////////////////////////////

    closeInspect.addEventListener("click", () => {
        gsap.timeline()
            .to(pokemonInspector, { duration: 0.2, opacity: 0 })
            .set(pokemonInspector, { display: "none" });
        setTimeout(() => {
            pokemonInspectorContent.innerHTML = "";
        }, 201);
    });

    infoBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Get pokemon info and update html
            Promise.all([
                axios.get(
                    `/api/trainers/oneTrainer/${trainerUsername}/${btn.dataset.pokemonId}`
                ),
                axios.get(`/api/pokemon/${btn.dataset.speciesId}`, {
                    id: btn.dataset.pokemonId,
                }),
            ])
                .then((responses) => {
                    const [trainerResponse, speciesResponse] = responses;
                    if (
                        trainerResponse.status === 200 &&
                        speciesResponse.status === 200
                    ) {
                        const pokemon = trainerResponse.data.pokemon;
                        const species = speciesResponse.data.pokemonInfo;
                        const trainerList = speciesResponse.data.trainerList;
                        let moves = pokemon.Moves.map((move) => {
                            let moveCapital = move.MoveName.split(" ").map(
                                (word) => word[0].toUpperCase() + word.slice(1)
                            );
                            return `<p>${moveCapital.join(" ")}</p>`;
                        }).join("\n");
                        let pokeName = species.Name.startsWith("mr.")
                            ? species.Name[0].toUpperCase() +
                              species.Name.slice(1, 4) +
                              species.Name[4].toUpperCase() +
                              species.Name.slice(5)
                            : species.Name[0].toUpperCase() +
                              species.Name.slice(1);
                        //extract pokemon types
                        let types = species.Type.map((type) => {
                            return `<p class="type ${type}">${type}</p>`;
                        }).join("\n");
                        let trainers = trainerList
                            .map((trainer) => {
                                return `<a href="/trainer/${trainer.Username}">${trainer.DisplayName}</a>`;
                            })
                            .join("\n");

                        // prettier-ignore
                        pokemonInspectorContent.innerHTML = `
              <div class="name-and-pic">
                <img src=${pokemon.ImgURL}>
                <p>Nickname</p>
                <h3>${pokemon.Nickname}</h3>
                <h4>Level ${pokemon.Level}</h4>
              </div>
              <div class="poke-info">
                <div class="types">
                  ${types}
                </div>
                <div class="move-div">
                  <h4>Moves</h4>
                  <div class="moves">
                    ${moves}
                  </div>
                </div>
              </div>
            `;

                        // prettier-ignore
                        speciesInfo.innerHTML = `
              <div class="species-info-container">
                <div class="species-stats">
                  <p class="species-label">Species</p>
                  <h3>${pokeName}</h3>
                  <p class="species-pokedex">Pokedex #${String(species.PokedexID).padStart(4, "0")}</p>
                </div>
                <div class="species-teams">
                  <h4>Teams On</h4>
                  <div class="owners-box">
                    ${trainers}
                  </div>
                </div>
              </div>
            `;
                    }
                })
                .catch((error) => {
                    console.error("Request failed", error);
                });
            // Show pokemon inspector
            gsap.timeline({ delay: 0.2 })
                .set(pokemonInspector, { display: "block" })
                .to(pokemonInspector, { duration: 0.2, opacity: 1 });
        });
    });

    speciesInfoBtn.addEventListener("click", () => {
        if (speciesInfoBtn.textContent == "Species Info >>") {
            gsap.to(pokemonInspector, {
                duration: 0.3,
                width: "900px",
                x: "-150px",
            });
            gsap.to(speciesInfo, {
                duration: 0.2,
                width: "300px",
                borderLeft: "solid 1px lightgray",
            });
            speciesInfoBtn.textContent = "<< Species Info";
        } else {
            gsap.to(pokemonInspector, {
                duration: 0.3,
                width: "600px",
                x: "0",
            });
            gsap.to(speciesInfo, {
                duration: 0.2,
                width: "0",
                borderLeft: "none",
            });
            speciesInfoBtn.textContent = "Species Info >>";
        }
    });
});
