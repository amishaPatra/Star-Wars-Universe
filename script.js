
function fetchPlanets(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const planetsContainer = document.getElementById('planetsContainer');

            
            data.results.forEach(planet => {
                const planetCard = document.createElement('div');
                planetCard.classList.add('planet-card');

                
                planetCard.innerHTML = `
                    <h2>${planet.name}</h2>
                    <p>Climate: ${planet.climate}</p>
                    <p>Population: ${planet.population}</p>
                    <p>Terrain: ${planet.terrain}</p>
                `;

                
                if (planet.residents.length > 0) {
                    const residentsList = document.createElement('ul');
                    residentsList.innerHTML = "<h3>Residents:</h3>";

                    
                    Promise.all(planet.residents.map(residentUrl =>
                        fetch(residentUrl).then(response => response.json())
                    ))
                    .then(residents => {
                        residents.forEach(resident => {
                            const residentDetails = document.createElement('li');
                            residentDetails.textContent = `Resident: ${resident.name}, Height: ${resident.height}, Mass: ${resident.mass}, Gender: ${resident.gender}`;
                            residentsList.appendChild(residentDetails);
                        });

                        planetCard.appendChild(residentsList);
                        planetsContainer.appendChild(planetCard);
                    })
                    .catch(error => console.error('Error fetching resident data:', error));
                } else {
                    planetsContainer.appendChild(planetCard);
                }
            });

            
            if (data.next) {
                const nextButtonContainer = document.createElement('div');
                nextButtonContainer.classList.add('pagination');
                
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next Page';
                nextButton.addEventListener('click', () => fetchPlanets(data.next));

                nextButtonContainer.appendChild(nextButton);
                planetsContainer.appendChild(nextButtonContainer);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}


const apiUrl = 'https://swapi.dev/api/planets/?format=json';
fetchPlanets(apiUrl);
