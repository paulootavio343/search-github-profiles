const APIURL = 'https://api.github.com/users/'
const form = document.getElementById('src-form');
const search = document.getElementById('search');
const card = document.getElementById('card-container');
const reposContainer = document.getElementById('repos');
const apiStatus = document.getElementById('api-status');

async function checkAPI() {
    await fetch(APIURL + 'octocat').then((response) => {
        if (response.status != '200') {
            apiStatus.textContent = 'API status: offline'
        } else {
            apiStatus.textContent = 'API status: online'
        }
    })
}

async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username);
        createUserCard(data);
    } catch (error) {
        if (error.response && error.response.status == 404) {
            createErrorCard('No profile with this username.');
        } else if (error.response) {
            createErrorCard('Error fetching data from the API.');
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos');
        createRepoCard(data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            createErrorCard('No repository found.');
        } else if (error.response) {
            createErrorCard('Error fetching data from the API.');
        }
    }
}

function createRepoCard(repos) {
    reposContainer.innerHTML = '';
    repos.forEach(repo => {
        let cardHTML = `
        <div class="repo">
            <div class="name">
                <a href="https://github.com/${repo.owner.login}/${repo.name}" target="_blank" rel="nofollow">${repo.name}</a>
                <span class="visibility">${repo.visibility}</span>
            </div>
    
            <div class="description">
                <p>${repo.description}</p>
            </div>
    
            <div class="info">
                <div class="topics">
                    <ul>`

        for (let i = 0; i < repo.topics.length; i++) {
            cardHTML += `<li>${repo.topics[i]}</li>`;
        }

        let updated_datetime = new Date(repo.updated_at).toLocaleString();

        cardHTML += `
                        <li>${repo.topics[0]}</li>
                    </ul>
                </div>
    
                <div class="info-2">
                    <div class="programing-language">
                        <img src="assets/icons/code.svg" alt="Programing language">
                        ${repo.language}
                    </div>
                    <div class="license">
                        <img src="assets/icons/balance.svg" alt="License">
                        ${repo.license.name}
                    </div>
                    <div class="updated">
                        <img src="assets/icons/schedule.svg" alt="Updated">
                        ${updated_datetime}
                    </div>
                    <div class="stars">
                        <img src="assets/icons/star.svg" alt="Stars">
                        ${repo.stargazers_count} stars
                    </div>
                    <div class="watching">
                        <img src="assets/icons/visibility.svg" alt="Watching">
                        ${repo.watchers} watching
                    </div>
                    <div class="forks">
                        <img src="assets/icons/share.svg" alt="Forks">
                        ${repo.forks} forks
                    </div>
                </div>
            </div>
        </div>
        `

        reposContainer.innerHTML += cardHTML;
    });
}

function createUserCard(user) {
    const cardHTML = `
    <div class="card">
        <div class="profile-picture">
            <img src="${user.avatar_url}" alt="">
        </div>

        <div class="info">
            <div class="name">
                <h1>${user.name}</h1>
                <span>${user.login}</span>
            </div>

            <div class="description">
                <p>${user.bio}</p>
            </div>

            <div class="numbers">
                <ul>
                    <li class="followers">${user.followers} followers</li>
                    <li class="following">${user.following} following</li>
                    <li class="repos">${user.public_repos} repos</li>
                </ul>
            </div>

            <div class="visit-profile">
                <a href="https://github.com/${user.login}" target="_blank" rel="nofollow">Visit profile</a>
            </div>
        </div>
    </div>
    `

    card.innerHTML = cardHTML;
}

function createErrorCard(message) {
    const cardHTML = `
    <div class="card">
        <h1>${message}</h1>
    </div>
    `

    card.innerHTML = cardHTML;
    reposContainer.innerHTML = '';
}

checkAPI();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);
        getRepos(user);
        search.value = '';
    }
})
