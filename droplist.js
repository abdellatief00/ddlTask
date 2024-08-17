const dropList = {
  init: function (args) {
    const { divId, data, onchange, is_deleted } = args;
    var createObejctNameObj = dropList.createObejctNameObj(divId);
    var createObjForDraw = dropList.createDrawDropDownListObj(
      args,
      createObejctNameObj
    );
    dropList.drawDropDownList(createObjForDraw);
    //dropList.addDataToTheButton(divId, JSON.stringify(args));
  },
  addDataToTheButton: function (divId, data) {
    let uniqueId = dropList.createUniuqeId(divId);
    let buttonElement = document.getElementById(uniqueId);
    buttonElement.setAttribute("user-data", data);
  },
  createDropListId: function (divId) {
    let uniqueId = dropList.createUniuqeId(divId);
    return uniqueId + "div";
  },
  getDropList: function (divId) {
    let uniqueId = dropList.createDropListId(divId);
    return document.getElementById(uniqueId);
  },
  drawDropDownList: function (data, showDropList = false) {
    const { items, names } = data;
    let userData = JSON.stringify(items);
    let dropId = dropList.createDropListId(items.divId);
    let uniqueId = dropList.createUniuqeId(items.divId);
    let show = showDropList ? "show" : "";
    builder = `<div id=${uniqueId} class="btn btn-primary dropdown-toggle" type="button"                     onclick="dropList.dropDownButton(event.target , '${items.divId}')" data-value="" user-data = '${userData}'>
                    أختر موظف
                    </div>
                    <div class="dropdown-menu text-end ${show} " id= "${dropId}">
                    `;
    builder += dropList.searchAndChooseFeatures(data);
    builder += dropList.createTheDivOfInnerOptions(data);
    builder += `</div>`;
    document.getElementById(items.divId).innerHTML = builder;
  },
  createUniuqeId: function (divId) {
    return (uniqueId = "div_ddl_" + String(divId));
  },

  createObejctNameObj: function (divId) {
    let name = document.getElementById(divId).getAttribute("ddl-label");
    let value = document.getElementById(divId).getAttribute("ddl-value");
    let element = document.getElementById(divId).getAttribute("ddl-elements");

    let obj = {
      name: name,
      value: value,
      children: element,
    };
    return obj;
  },
  createDrawDropDownListObj: function (data, nameObj) {
    return (obj = {
      items: data,
      names: nameObj,
    });
  },
  dropDownButton: function (event, divId) {
    //event.nextElementSibling.classList.toggle("show");
    let dropListmenu = dropList.getDropList(divId);
    dropListmenu.classList.toggle("show");

    // if (dropListmenu.classList.contains("show")) {
    //   dropList.resetSearch(divId);
    // }
  },

  selectedItem: function (event, divId, onChangefunc) {
    var value = event.target.getAttribute("data-value");
    if (event.target.tagName != "DIV") {
      value = event.target.parentElement.getAttribute("data-value");
    }
    dropList.excuteOnChangeFunc(onChangefunc, divId, value);
    dropList.setSelectedValue(divId, value, event);
  },
  setSelectedValue: function (divId, value, event) {
    let uniqueId = dropList.createUniuqeId(divId);
    let buttonElement = document.getElementById(uniqueId);
    buttonElement.setAttribute("data-value", value);
    buttonElement.textContent = event.target.textContent.trim();
    dropList.dropDownButton(buttonElement, divId);
  },
  excuteOnChangeFunc(onChangefunc, divId, selectedVal) {
    let uniqueId = dropList.createUniuqeId(divId);
    var buttonElement = document.getElementById(uniqueId);
    var value = buttonElement.getAttribute("data-value");
    if (value != selectedVal) onChangefunc(selectedVal);
  },
  ///////////////////////////multiSelect/////////////////////

  createInnerDivId: function (divId) {
    return dropList.createUniuqeId(divId) + "innerDiv";
  },
  createTheDivOfInnerOptions: function (data) {
    const { items, names } = data;
    let unid = dropList.createInnerDivId(items.divId);
    let builder = `<div id = '${unid}'>`;
    items.data.forEach((element, index) => {
      let divFunc = dropList.getParentDivFunc(data, element, index);

      let CheckBox = dropList.createInnerOptions(data, element, index);
      let dataValue = element.hasOwnProperty(names.children)
        ? ``
        : ` data-value="${element[names.value]}"`;
      builder += `
                        <div class="me-2"  ${dataValue} ${divFunc}>
                            ${CheckBox}
                        </div>
                        `;
    });
    builder += "</div>";
    return builder;
  },

  createInnerOptions: function (data, element, index) {
    const { items, names } = data;
    uniqueId = dropList.createUniuqeId(items.divId);
    let checkBoxId = uniqueId + index;
    let innerOptions = dropList.createTree(data, element, index, checkBoxId);
    if (items.hasMultiSelect != null && items.hasMultiSelect == true) {
      let innerInputFunction = dropList.createInnerInputFunction(
        data,
        element,
        index
      );

      let inputValue = `
            <label for="${checkBoxId}">${element[names.name]}</label>
            <input type="checkbox" class="form-check-input" name="${
              items.divId
            }" id="${checkBoxId}" onClick="${innerInputFunction}">
            ${innerOptions}`;
      return inputValue;
    }
    if (items.hasMultiSelect == false || items.hasMultiSelect == null) {
      let inputValue = `
            <label>${element[names.name]}</label>
            ${innerOptions}`;
      return inputValue;
    }

    return "";
  },

  getParentDivFunc: function (data, element, index) {
    const { items, names } = data;
    let elementName = names.children;
    let onClick = "onClick = ";
    if (
      items.hasMultiSelect != null &&
      items.hasMultiSelect == true &&
      element.hasOwnProperty(elementName)
    ) {
      return (
        onClick +
        `"dropList.selectAllInnerCheckBoxes(event.target, '${items.divId}')"`
      );
    }
    if (items.hasMultiSelect != null && items.hasMultiSelect == true)
      return (
        onClick +
        `"dropList.divMultiSelect(event, '${items.divId}',${items.onchange})"`
      );
    if (
      (items.hasMultiSelect == false || items.hasMultiSelect == null) &&
      element.hasOwnProperty(elementName)
    )
      return "";

    if (items.hasMultiSelect == false || items.hasMultiSelect == null)
      return (
        onClick +
        `"dropList.selectedItem(event,'${items.divId}',${items.onchange})"`
      );

    return "";
  },

  createInnerInputFunction: function (data, element, index) {
    const { items, names } = data;
    let elementName = names.children;
    if (
      items.hasMultiSelect != null &&
      items.hasMultiSelect == true &&
      element.hasOwnProperty(elementName)
    ) {
      return `dropList.selectAllCheckBoxesbox(event.target, '${items.divId}')`;
    }
    if (items.hasMultiSelect != null && items.hasMultiSelect == true)
      return `dropList.checkBoxEvent(event.target, '${items.divId}',${items.onchange})`;
  },

  ////////////////////////////////create a tree/////////////////////////

  createTree: function (data, element, index, checkBox) {
    const { items, names } = data;
    elementName = names.children;
    let builder = ``;
    var createEle = ``;
    if (element.hasOwnProperty(elementName)) {
      element[elementName].forEach((ele, ind) => {
        let dataValue = ele.hasOwnProperty(names.children)
          ? ``
          : ` data-value="${ele[names.value]}"`;
        let divFunc = dropList.getParentDivFunc(data, ele, ind);

        createEle += `<div class="me-2" ${dataValue} parent-div = '${checkBox}' ${divFunc} >`;
        createEle += dropList.createInnerOptions(data, ele, "" + index + ind);
        createEle += `</div>`;
      });
      builder += `<div>
                ${createEle}
                </div>`;
    }
    return builder;
  },

  selectAllInnerCheckBoxes: function (event, divId) {
    if (event.tagName == "DIV") {
      let allChecks = event.querySelectorAll('input[type="checkbox"]');
      allChecks[0].checked = !allChecks[0].checked;
      dropList.selectAllCheckBoxesbox(allChecks[0], divId);
    }
  },
  selectAllCheckBoxesbox: function (event, divId) {
    let parentDiv = event.parentElement;
    let allChecks = parentDiv.querySelectorAll('input[type="checkbox"]');
    if (allChecks.length > 0) {
      allChecks.forEach((ele) => {
        ele.checked = allChecks[0].checked;
      });
    }
    dropList.addAllCheckedToAttr(allChecks, divId);
  },

  addAllCheckedToAttr: function (allChecks, divId) {
    allChecks.forEach((ele) => {
      dropList.setValueOfCheckAll(ele, divId);
    });
  },
  /////////////////////////////////////////////////////////

  divMultiSelect: function (event, divId, onchange) {
    event.stopPropagation();
    if (event.target.tagName == "DIV") {
      checkBox = event.target.querySelector('input[type="checkbox"]');
      checkBox.checked = !checkBox.checked;
      dropList.checkBoxEvent(checkBox, divId, onchange);
    }
  },

  setValueOfCheckAll: function (event, divId) {
    let parent = event.parentElement;
    if (!parent.hasAttribute("data-value")) {
      return null;
    }
    let value = parent.getAttribute("data-value");
    let uniqueId = dropList.createUniuqeId(divId);
    let theParentButton = document.getElementById(uniqueId);
    let allValues = theParentButton.getAttribute("data-value");
    let checkVal = event.checked;
    let val = dropList.createArrayOfValues(allValues, value, checkVal);
    theParentButton.setAttribute("data-value", val);

    dropList.checkAllChildCheckBoxes(parent, divId);
    return val;
  },

  checkAllChildCheckBoxes: function (parent, divId) {
    if (!parent.hasAttribute("parent-div")) {
      return;
    }
    let parentcheckBoxId = parent.getAttribute("parent-div");
    let parentcheckBox = document.getElementById(parentcheckBoxId);
    let parentDiv = parent.parentElement;

    let checkboxes = parentDiv.querySelectorAll(
      "input[type='checkbox']:not(:disabled)"
    );

    let allChecked = true;
    checkboxes.forEach(function (checkbox) {
      if (!checkbox.checked) {
        allChecked = false;
      }
    });
    parentcheckBox.checked = allChecked;
    dropList.setValueOfCheckAll(parentcheckBox, divId);
  },

  checkBoxEvent: function (event, divId, onchange) {
    let val = dropList.setValueOfCheckAll(event, divId);
    if (val != null) onchange(val);
  },

  createArrayOfValues: function (allvalues, value, checkVal) {
    if (allvalues === "") {
      allvalues = [];
    }
    if (typeof allvalues === "string") {
      allvalues = allvalues.split(",").filter((v) => v); // Remove empty strings
    }
    if (checkVal) {
      if (!allvalues.includes(value)) {
        allvalues.push(value);
      }
    } else {
      allvalues = allvalues.filter((val) => val !== value);
    }
    return allvalues;
  },

  /////////////////////search, choose All , Cancel Chosen///////////////////
  searchAndChooseFeatures: function (data) {
    const { items, names } = data;
    let builder = "";
    let uniqueId = dropList.createUniuqeId(items.divId) + "search";
    if (items.hasSearch == true && items.hasSearch != null) {
      builder += `<input type="text" placeholder="البحث" dir="rtl" id="${uniqueId}" class="text-right form-control mb-2" onInput= dropList.searchFeature(event.target,"${items.divId}") >`;
    }
    if (
      items.hasSelectAll == true &&
      items.hasSelectAll != null &&
      items.hasMultiSelect == true
    ) {
      builder += `<div class = "mt-2 me-2">
            <input type="button" value= "أختيار الكل" onClick= "dropList.selectAll('${items.divId}') " class="btn btn-success">
            <input type="button" value= "حذف الكل" onClick= "dropList.cancelSelect('${items.divId}')" class="btn btn-danger ">
            </div>`;
    }
    return builder;
  },

  searchFeature: function (event, divId) {
    //let parentbutton = dropList.getParentButton(divId);
    // let user_data = parentbutton.getAttribute("user-data");
    // let data = JSON.parse(user_data);
    // let userObjInfo = dropList.createObejctNameObj(divId);
    // const { name, value, children } = userObjInfo;

    //let searchValue = event.value.toLowerCase();
    // // Filter the objects in data.data based on the search value and the key stored in the variable 'name'
    // let filteredResults = data.data.filter((item) => {
    //   if (item[name]) {
    //     return item[name].toLowerCase().includes(searchValue);
    //   }
    //   return false;
    // });
    // data.data = filteredResults;
    // var createObjForDraw = dropList.createDrawDropDownListObj(
    //   data,
    //   userObjInfo
    // );
    // let innerOpt = dropList.createTheDivOfInnerOptions(createObjForDraw);
    // let theReplaceableDivId = dropList.createInnerDivId(divId);
    // let replaceableDiv = document.getElementById(theReplaceableDivId);
    // replaceableDiv.innerHTML = innerOpt;
    // dropList.getDropList(divId).innerHTML = innerSearch;
    // dropList.getDropList(divId).innerHTML += innerOpt;
    //dropList.drawDropDownList(createObjForDraw, true);

    // let uniqueId = dropList.getDropListName(divId);
    // let parentDiv = document.getElementById(uniqueId);

    // let labels = parentDiv.getElementsByTagName("label");
    // dropList.showAndHideDivs(labels, searchValue);

    let parentId = dropList.createInnerDivId(divId);
    let parentDiv = document.getElementById(parentId);
    let searchValue = event.value.toLowerCase();
  },

  showAndHideDivs: function (labels, val) {
    for (let i = 0; i < labels.length; i++) {
      let label = labels[i];
      let labelText = label.textContent.toLowerCase();
      let labelParent = label.parentElement;

      if (labelText.includes(val)) {
        labelParent.style.display = "";
      } else {
        labelParent.style.display = "none";
      }
    }
  },

  getSearchinput: function (divId) {
    let uniqueId = dropList.createUniuqeId(divId) + "search";
    let button = document.getElementById(uniqueId);
    return button;
  },
  resetSearch: function (divId) {
    let button = dropList.getSearchinput(divId);
    if (button != null) {
      button.value = "";
      dropList.searchFeature(button, divId);
    }
  },
  getDropListName: function (divId) {
    let unique = dropList.createUniuqeId(divId) + "div";
    return unique;
  },
  selectAll: function (divId) {
    let unique = dropList.getDropListName(divId);
    let dropListMenu = document.getElementById(unique);
    let selectedValues = [];

    if (dropListMenu) {
      let checkboxes = dropListMenu.querySelectorAll('input[type="checkbox"]');

      checkboxes.forEach(function (checkbox) {
        checkbox.checked = true;
        let parentDiv = checkbox.parentElement.closest("div");

        if (parentDiv) {
          let value = parentDiv.getAttribute("data-value");
          if (value) {
            selectedValues.push(value);
          }
        }
      });
    }
    let parentButton = dropList.getParentButton(divId);
    parentButton.setAttribute("data-value", selectedValues);
  },
  cancelSelect: function (divId) {
    let unique = dropList.getDropListName(divId);
    let dropListMenu = document.getElementById(unique);
    if (dropListMenu) {
      let checkboxes = dropListMenu.querySelectorAll('input[type="checkbox"]');

      checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
      });
    }
    let parentButton = dropList.getParentButton(divId);
    parentButton.setAttribute("data-value", "");
  },

  getParentButton: function (divId) {
    let parentButtonid = dropList.createUniuqeId(divId);
    let parentButton = document.getElementById(parentButtonid);
    return parentButton;
  },
  ////////////////////////////////////
};
