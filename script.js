category_container = document.getElementById("category-container");

function loaddata() {
  fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then((response) => response.json())
    .then((data) => createCategory(data.data));
}
loaddata();
function createCategory(categories) {
  // console.log(categories);
  for (let category of categories) {
    let category_item = document.createElement("div");
    category_item.classList.add("category-item", "nav-item");
    category_item.innerHTML = `
        <button class="nav-link btn btn-info" id="${category.category_id}">${category.category}</button>
        `;

    if (category.category_id === "1000") {
      category_item.querySelector("button").classList.add("active");
      fetch(
        `https://openapi.programming-hero.com/api/videos/category/${category.category_id}`
      )
        .then((res) => res.json())
        .then((data) => createItem(data.data));
    }

    category_item.addEventListener("click", (e) => {
      document.querySelectorAll(".category-item button").forEach((button) => {
        button.classList.remove("active");
      });

      e.target.classList.add("active");

      // console.log(e.target.textContent);
      fetch(
        `https://openapi.programming-hero.com/api/videos/category/${category.category_id}`
      )
        .then((res) => res.json())
        .then((data) => createItem(data.data));
    });

    category_container.appendChild(category_item);
  }
}

let order_of_sort = "desc";

const sortByViewButton = document.querySelector("#sortByViewButton");
sortByViewButton.addEventListener("click", () => {
  order_of_sort = order_of_sort === "desc" ? "asc" : "desc";

  const categoryId = document.querySelector(".category-item button.active").id;
  console.log(categoryId);

  fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  )
    .then((res) => res.json())
    .then((data) => {
      data.data.sort((item1, item2) => {
        const view1 =
          parseFloat(item1.others.views) *
          (item1.others.views.endsWith("K") ? 1000 : 1);
        const view2 =
          parseFloat(item2.others.views) *
          (item2.others.views.endsWith("K") ? 1000 : 1);

        if (order_of_sort === "asc") {
          return view1 - view2;
        } else {
          return view2 - view1;
        }
      });
      createItem(data.data);
    })
    .catch((error) => console.error("error:", error));
});

function createItem(items) {
  item_container = document.getElementById("item-container");
  item_container.innerHTML = "";
  if (items.length == 0) {
    item_container.innerHTML = `
      <div class="d-flex flex-column gap-3 pt-5 justify-content-center align-items-center">
        <img src="./icon.png">
        <h3>Oops!! Sorry, There is no content here</h3>
      </div>
    `;
  } else {
    for (let item of items) {
      let item_div = document.createElement("div");
      item_div.classList.add("card", "card-style"); 

      const verifiedIcon = item.authors[0].verified
        ? '<i class="fa-solid fa-certificate icon-certificate"><i class="fa-solid fa-check icon-check"></i></i>'
        : "";

      const postDate = calculatePostedDate(item.others.posted_date);

      item_div.innerHTML = `

        <img src="${item.thumbnail}" class="card-img-top w-100 h-50 position-relative" alt="...">
        <div class="card-body">
          <img src=${item.authors[0].profile_picture} class="profile-picture">
          <p class="posted-date">${postDate}</p>
          <div>
            <h5 class="pt-1">${item.title}</h5>
            <p>${item.authors[0].profile_name} <span>${verifiedIcon}</span></p>
            <p>${item.others.views} views</p>
          </div>
        </div>
      `;

      item_container.appendChild(item_div);
    }
  }
}


function calculatePostedDate(postDate) {
  const days = Math.floor(postDate / (60 * 60 * 24));
  const hours = Math.floor((postDate % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((postDate % (60 * 60)) / 60);

  let s = "";

  if (days > 0) {
    s = s + `${days} days `;
  }
  if (hours > 0) {
    s = s + `${hours} hours `;
  }
  if (minutes > 0) {
    s = s + `${minutes} minutes `;
  }
  if (days > 0 || hours > 0 || minutes > 0) {
     s = s + "ago";
  } 
  return s.trim();
}


function blogItem() {
  category_container.innerHTML = "";
  item_container = document.getElementById("item-container");
  item_container.innerHTML = "";

  blogItem_container = document.getElementById("blogitems");
  blogItem_container.innerHTML = `
     <div class="accordion" id="accordionPanelsStayOpenExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
        Discuss the scope of var, let, and const ..
      </button>
    </h2>
    <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
      <div class="accordion-body">
        <strong>Var: </strong> The var statement declares a function-scoped or global-scoped variable. When declared within a function, the variable can be accessed from anywhere within that function. Similarly, when declared in the global scope, the variable can be accessed from anywhere.
        <code><pre>
           function check() {
                      if (true) {
                        var x = 10;
                      }
                      console.log(x);
            }
          </pre>
        </code>
        <br />
        <strong>Let: </strong> The let statement declares a block-scoped or local-scoped variable. When declared within a function, the variable can only be accessed within that function. Similarly, when declared in the global scope, the variable can only be accessed within the global scope.
        <br />
        <strong>Const: </strong> The const statement declares a block-scoped or local-scoped constant. When declared within a function, the variable cannot be reassigned within that function. Similarly, when declared in the global scope, the variable cannot be reassigned within the global scope.
        <code><pre>
           function check() {
                  if (true) {
                    let y = 20;
                    const z = 30;
                    // z = 40 // Error
                  }
                  // console.log(y); // Error: y is not defined
                  // console.log(z); // Error: z is not defined
           }

       </pre></code>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
        Tell us the use cases of null and undefined..
      </button>
    </h2>
    <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse">
      <div class="accordion-body">
         <strong>Null: </strong> The null keyword is used to represent the absence of a value.Used to represent the intentional absence of any object value or no value or unknown value.
         <br />
         Typically assigned to a variable that the variable has no value.
         <code>
           <pre>
             let value = null;
           </pre>
         </code>
        <br />
        <strong>Undefined: </strong> The undefined keyword is used to represent the absence of a valueIt represents the uninitialized state of a variable.variables that are declared but not initialized are assigned 'undefined' by default.
        <code>
           <pre>
             let value;
             console.log(value);
           </pre>
         </code>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree"> 
            What do you mean by REST API?
      </button>
    </h2>
    <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse">
      <div class="accordion-body">
        <strong>REST API:</strong>
        An API, or application programming interface, is a set of rules that define how applications or devices can connect to and communicate with each other.. A REST API is an API that conforms to the design principles of the REST, or representational state transfer architectural style.RESTful APIs use standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources.REST APIs are widely used for web services, allowing different systems to communicate over the web in a standardized way.
    </div>

    </div>
  </div>
</div>
  
  `;
}

const blog = document.querySelector("#blog");
blog.addEventListener("click", () => {
  item = blog.innerHTML;
  console.log(item);
  if (item == "Blog") {
    blog.innerHTML = "All Items";
    blogItem();
  } else {
    blog.innerHTML = "Blog";
    blogItem_container = document.getElementById("blogitems");
    blogItem_container.innerHTML = "";
    loaddata();
  }
});
