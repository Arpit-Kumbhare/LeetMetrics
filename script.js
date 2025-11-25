document.addEventListener('DOMContentLoaded', function(){
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('input-button');
    const easyLabel = document.querySelector(".easy-label");
    const midLabel = document.querySelector(".mid-label");
    const hardLabel = document.querySelector(".hard-label");
    const easyStats = document.querySelector(".easy-stats");
    const midStats = document.querySelector(".mid-stats");
    const hardStats = document.querySelector(".hard-stats");
    const statsCard = document.querySelector(".card");

    // validate username: returns true or false 
    function validateUsername(userName){
        if(userName.trim() === ""){
            alert("Username cannot be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;
        const isMatching = regex.test(userName);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    // fetch data from server 
    async function fetchUserDetails(userName){
        const url = `https://leetcode-stats-api.herokuapp.com/${userName}`

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;        

            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch user data");
            }
            
            const data = await response.json();
            
            if (data.message === "user does not exist") {
                alert("Username does not exist on LeetCode");
                return;
            }
            
            console.log(data);
            displayData(data);
        }
        catch(error){
            alert("Error fetching data. Please try again later.");
            console.error(error);
        }
        finally{
            searchButton.disabled = false;
            searchButton.innerHTML = '<span class="btn-text">Search</span><span class="btn-icon">→</span>';
        }
    }
    
    function updateStats(total, solved, label, stats){
        const percent = (solved/total)*100;
        stats.querySelector(".circle-inner").style.setProperty("--stat-degree", `${percent}%`);
        label.textContent = `${solved}/${total}`;
        console.log(percent);
    }

    // display user data
    function displayData(data){
        const totalEasyQues = data.totalEasy;
        const totalMidQues = data.totalMedium;
        const totalhardQues = data.totalHard;

        const solvedEasy = data.easySolved;
        const solvedMid = data.mediumSolved;
        const solvedHard = data.hardSolved;

        updateStats(totalEasyQues, solvedEasy, easyLabel, easyStats);
        updateStats(totalMidQues, solvedMid, midLabel, midStats);
        updateStats(totalhardQues, solvedHard, hardLabel, hardStats);

        const cardData = [
            {label: "Acceptance Rate", Value: data.acceptanceRate
            },
            {label: "Contribution Points", Value: data.contributionPoints
            }
        ]

        console.log(cardData);

        statsCard.classList.add("visible");

        statsCard.innerHTML = cardData.map(
            ({label, Value}) =>   
                    `<div class="card-data">
                        <h2>${label}</h2>
                        <p>${Value}</p>
                    </div>
                `
        ).join("");
    }

    searchButton.addEventListener('click', function(event){
        event.preventDefault();
        const userName = searchInput.value;
        console.log(userName);
        if(validateUsername(userName)){
            fetchUserDetails(userName);
        }
    })

    // Allow search on Enter key
    searchInput.addEventListener('keypress', function(event){
        if(event.key === 'Enter'){
            event.preventDefault();
            searchButton.click();
        }
    })

})
