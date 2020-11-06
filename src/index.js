let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  
  let toysData = "http://localhost:3000/toys"
  let toyCollection = document.querySelector("#toy-collection")
  
  fetch(toysData)
  .then(response => response.json())
  .then(data => buildToyCollection(data))
  

  function buildToyCollection(data) {
    data.forEach(buildToyCard)
  }
  

  function buildToyCard(toy) {
    const div = document.createElement("div")
    div.classList.add("card")
    div.setAttribute("toy-id", toy.id)
    div.innerHTML = 
      `<h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar">
      <p class="likes-count">${toy.likes} likes</p>
      <button class="like-btn">❤️</button>`
    toyCollection.append(div)
    
    const likeButton = div.querySelector("button.like-btn")
    likeButton.addEventListener("click", addLike)
    
    function addLike() {
        toy.likes++;
        
        let configObject = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ likes: toy.likes })
        }
        
        return fetch(toysData + `/${toy.id}`, configObject)
          .then(function(response){
            return response.json()
          }).then(function(data){
            div.querySelector("p.likes-count").textContent = `${toy.likes} likes`
          }) .catch(function(error) {
            alert(error.message)
          })
    }
    
    
  }
  
  const newToyForm = document.querySelector(".add-toy-form")
  function getNewToy() {
    const toy = {
        name: newToyForm.name.value,
        image: newToyForm.image.value,
        likes: 0
    }
    return toy
  }
  

  function submitData(toy) {
    let configObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(toy)
    }

    return fetch("http://localhost:3000/toys", configObject)
        .then(function(response){
            return response.json()
        }).then(function(data){
            buildToyCard(data)
        }) .catch(function(error) {
            alert(error.message)
        })
  }
  

  newToyForm.addEventListener("submit", submitNewToy);
  function submitNewToy(event) {
    event.preventDefault();
    const newToy = getNewToy();
    submitData(newToy)
    newToyForm.reset()
  }
  
  
  
})
