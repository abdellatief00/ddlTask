let userObj = {
  createList: function () {
    let obj = {
      hasSearch: true,
      hasMultiSelect: true,
      hasSelectAll: false,
      hasCollapse: false,
      divId: "firstDropDown",
      data: [
        { name: "ahmed", val: 1 },
        { name: "abdellatief", val: 2 },
        {
          name: "sayed",
          val: 3,
          elements: [
            // { name: "nader", val: 5 },
            //{ name: "gamal", val: 6 },
            {
              name: "abdo",
              val: 7,
              elements: [
                { name: "nader shah", val: 8 },
                { name: "gamal rahem", val: 9 },
              ],
            },
          ],
        },
      ],
      onchange: function (data) {
        console.log(data);
      },
    };
    dropList.init(obj);
  },
};

userObj.createList();

// function dropDownButton(event) {
//     event.target.nextElementSibling.classList.toggle("show");
// }

// function selectedItem(event) {
//     document.getElementById("dropdown-button").textContent = event.target.textContent;
//     document.getElementById("dropdown-button").nextElementSibling.classList.toggle("show");
// }

/* <div class="dropdown-item" data-value="${element[names.value]}" onclick="dropList.selectedItem(event,'${uniqueId}',${items.onchange})">
${CheckBox}
</div>
`; */
