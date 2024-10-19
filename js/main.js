const CUSTOMERS_ID = "#customers";
const ASC_SORT_BTN_ID = "#asc-sort";
const DESC_SORT_BTN_ID = "#desc-sort";
const SORT_BTN_ID = "#sort-btn";
const ASC_SORT_BTN_TEXT = "Filter by Name (A-Z)";
const DESC_SORT_BTN_TEXT = "Filter by Name (Z-A)";
const ASC_ORDER = "asc";
const DESC_ORDER = "desc";
const CUSTOMERS_FILTER_ID = "#customers-filter";

let photos = [
  "images/image1.png",
  "images/image2.jpeg",
  "images/image3.jpeg",
  "images/image4.jpeg",
  "images/image5.png",
  "images/image6.png",
  "images/image7.png",
  "images/image8.png",
];

let customers = [];

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const filterCustomers = () => {
  let searchString = $(CUSTOMERS_FILTER_ID).val();
  let filteredCustomers = customers.filter((element) =>
    element.name.includes(searchString)
  );

  if (filteredCustomers.length > 0) {
    displayCustomers(filteredCustomers);
  } else {
    displayEmptyMessage();
  }
};

const updateSortButtonText = (order = ASC_ORDER) => {
  if (order == ASC_ORDER) {
    $(SORT_BTN_ID).text(ASC_SORT_BTN_TEXT);
  } else {
    $(SORT_BTN_ID).text(DESC_SORT_BTN_TEXT);
  }
};

const sortCustomers = (order = ASC_ORDER) => {
  updateSortButtonText(order);

  if (order == ASC_ORDER) {
    customers.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  } else {
    customers.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameB < nameA) {
        return -1;
      } else if (nameB > nameA) {
        return 1;
      }

      return 0;
    });
  }

  displayCustomers();
};

const getRandomPhotoUrl = (id) => {
  let url = "";
  if (id > 0 && id <= photos.length) {
    url = photos[id - 1];
  } else {
    let index = Math.floor(Math.random() * photos.length);
    url = photos[index];
  }

  return url;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const renderCustomerCard = (customer) => {
  return `<div class="card my-2">
  <img src="${getRandomPhotoUrl(
    customer.id
  )}" class="card-img-top" alt="Customer's image" style="height:200px; object-fit:cover;" />
  <div class="card-body">
    <h5 class="card-title">${customer.name}</h5>
    <h6 class="card-subtitle mb-2 text-body-tertiary">@${customer.username}</h6>
    <p class="card-subtitle my-4 text-info">"${
      customer.company.catchPhrase
    }"</p>
    <p class="card-text">
      <i class="fa-solid fa-envelope text-primary"></i>
      <span class="ps-2">
      ${customer.email}
      </span>
    </p>
    <p class="card-text">
      <i class="fa-solid fa-location-dot text-primary"></i>
      <span class="ps-2">
      ${customer.address.street}, 
      ${customer.address.suite}, 
      ${customer.address.city}, ${customer.address.zipcode}, 
      ${customer.address.geo.lat}, ${customer.address.geo.lng}, 
      </span>
    </p>
    <p class="card-text">
      <i class="fa-solid fa-phone text-primary"></i>
      <span class="ps-2">
      ${customer.phone}
      </span>
    </p>
    <p class="card-text">
      <i class="fa-solid fa-globe text-primary"></i>
      <span class="ps-2">
      ${customer.website}
      </span>
    </p>
    <p class="card-text">
      <i class="fa-solid fa-briefcase text-primary"></i>
      <span class="ps-2">
      ${customer.company.name}
      </span>
    </p>
    <p class="card-text">
      <i class="fa-solid fa-industry text-primary"></i>
      <span class="ps-2">
      ${capitalizeFirstLetter(customer.company.bs)}
      </span>
    </p>
  </div>
</div>`;
};

const displayCustomers = (customersToDisplay = []) => {
  let htmlContent = "";
  if (customersToDisplay.length == 0) {
    customersToDisplay.push(...customers.map((obj) => ({ ...obj })));
  }

  htmlContent += "<div class='row'>";
  customersToDisplay.forEach((customer) => {
    htmlContent += "<div class='col-12 col-sm-6 col-lg-4 col-xl-3'>";
    htmlContent += renderCustomerCard(customer);
    htmlContent += "</div>";
  });
  htmlContent += "</div>";

  $(CUSTOMERS_ID).html(htmlContent);
};

const displayEmptyMessage = () => {
  let htmlContent = `<div class="mt-5 d-flex justify-content-center">
                no customer(s) found with the search criteria.
              </div>`;

  $(CUSTOMERS_ID).html(htmlContent);
};

const fetchData = async () => {
  return fetch("https://jsonplaceholder.typicode.com/users").then((response) =>
    response.json()
  );
};

$(document).ready(async () => {
  let customersData = await fetchData();

  customers = customersData;
  displayCustomers();

  $(ASC_SORT_BTN_ID).on("click", function () {
    sortCustomers();
  });
  $(DESC_SORT_BTN_ID).on("click", function () {
    sortCustomers("desc");
  });

  $(CUSTOMERS_FILTER_ID).on("input", debounce(filterCustomers));
});
