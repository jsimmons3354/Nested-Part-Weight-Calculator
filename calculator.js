document.addEventListener('DOMContentLoaded', function () {
    var addPartGroupButton = document.getElementById("addPartGroupButton");
    addPartGroupButton.addEventListener('click', addPartGroup);

    var calculatorForm = document.getElementById("calculatorForm");
    calculatorForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        var totalWeightOfAllPartGroups = 0; // Define totalWeightOfAllPartGroups variable
        var remainingMaterialWeight = 0; // Define remaining material weight variable
        var remnantWeightShare = 0;

        // Validate inputs
        var thicknessInput = document.getElementById("stock_thickness");
        var thicknessError = document.getElementById("thicknessError");
        var sqinchesInput = document.getElementById("stock_sq_inches");
        var sqinchesError = document.getElementById("sqinchesError");

        if (thicknessInput.value === "") {
            thicknessError.style.display = "inline"; // Show error message
            return;
        } else {
            thicknessError.style.display = "none"; // Hide error message if input is not empty
        }

        if (sqinchesInput.value === "") {
            sqinchesError.style.display = "inline"; // Show error message
            return;
        } else {
            sqinchesError.style.display = "none"; // Hide error message if input is not empty
        }

        // Calculate stock weight
        var stockThickness = parseFloat(thicknessInput.value);
        var stockSqInches = parseFloat(sqinchesInput.value);
        var materialDensity = parseFloat(document.getElementById("material_density").value);
        var stockWeight = stockThickness * stockSqInches * materialDensity;

        // Display stock weight
        var stockWeightResult = document.getElementById("stockWeightResult");
        if (stockWeightResult) {
            stockWeightResult.innerText = "Stock Weight: " + stockWeight.toFixed(2) + " pounds";
        }

        // Calculate and display total weight for each part group
        var partGroups = document.querySelectorAll(".partGroup");
        var partGroupsResult = "";
        partGroups.forEach(function(partGroup) {
            var partsContainer = partGroup.querySelector(".partsContainer");
            var partFields = partsContainer.querySelectorAll(".part");
            var totalPartWeight = 0;

            partFields.forEach(function(partField) {
                var partSqInches = parseFloat(partField.querySelector("input[name='partSqInches[]']").value);
                var partQuantity = parseFloat(partField.querySelector("input[name='partQuantity[]']").value);
                var partWeight = stockThickness * partSqInches * materialDensity * partQuantity;
                totalPartWeight += partWeight;
            });

            // Update totalWeightOfAllPartGroups
            totalWeightOfAllPartGroups += totalPartWeight;
        });

        //Get remaining weight of material
        remainingMaterialWeight = stockWeight - totalWeightOfAllPartGroups;

        // Calculate percentage share of the remnant for each part group
        partGroups.forEach(function(partGroup) {
            var partsContainer = partGroup.querySelector(".partsContainer");
            var partFields = partsContainer.querySelectorAll(".part");
            var totalPartWeight = 0;

            partFields.forEach(function(partField) {
                var partSqInches = parseFloat(partField.querySelector("input[name='partSqInches[]']").value);
                var partQuantity = parseFloat(partField.querySelector("input[name='partQuantity[]']").value);
                var partWeight = stockThickness * partSqInches * materialDensity * partQuantity;
                totalPartWeight += partWeight;
            });

            // Calculate percentage share of the remnant for this part group
            var partGroupShare = totalPartWeight / totalWeightOfAllPartGroups;
            remnantWeightShare = partGroupShare * remainingMaterialWeight;

            // Get the part group name
            var partGroupName = partGroup.querySelector(".groupNameText").textContent;

            // Calculate total weight considering percent markup
            var percentMarkup = parseFloat(partGroup.querySelector("input[name='percentInput[]']").value);
            var totalWeightWithMarkup = (totalPartWeight + remnantWeightShare) * (1 + percentMarkup / 100);

            // Display part group total weight
            partGroupsResult += partGroupName + " Total Weight: " + totalWeightWithMarkup.toFixed(2) + " LBS<br>";
        });

        var partGroupsResultElement = document.getElementById("partGroupResults");
        if (partGroupsResultElement) {
            partGroupsResultElement.innerHTML = partGroupsResult;
        }
    });

    // Update material density input box with the default value for the first material option
    updateMaterialDensity();
});


function addPartGroup() {
    var container = document.getElementById("partGroups");
    var partGroup = document.createElement("div");
    partGroup.classList.add("partGroup");

    //line breaks
    var br1 = document.createElement("br");
    var br2 = document.createElement("br");

    // Get part group name
    var partGroupNameInput = document.getElementById("partGroupName");
    var partGroupName = partGroupNameInput.value;

    // Create text node for part group name
    var groupNameText = document.createElement("span");
    groupNameText.classList.add("groupNameText");
    groupNameText.textContent = partGroupName;

    // Button to add parts to this group
    var addPartButton = document.createElement("button");
    addPartButton.textContent = "Add Part";
    addPartButton.addEventListener("click", addPart);

    // Button to delete this part group
    var deletePartGroupButton = document.createElement("button");
    deletePartGroupButton.textContent = "Delete Part Group";
    deletePartGroupButton.addEventListener("click", function() {
        container.removeChild(partGroup);
    });

    // Container for parts within this group
    var partsContainer = document.createElement("div");
    partsContainer.classList.add("partsContainer");

    //Markup text
    var markupText = document.createTextNode("Weight Markup:");
    var percentSymbol = document.createTextNode("%");

    // Markup percent input field
    var percentInput = document.createElement("input");
    percentInput.type = "number";
    percentInput.placeholder = "Percent";
    percentInput.name = "percentInput[]";
    percentInput.value = 30; // Default value

    // Add a default part field
    partsContainer.appendChild(createPartField());

    // Append elements to part group
    partGroup.appendChild(groupNameText);
    partGroup.appendChild(br1);
    partGroup.appendChild(addPartButton);
    partGroup.appendChild(deletePartGroupButton);
    partGroup.appendChild(br2);
    partGroup.appendChild(markupText);
    partGroup.appendChild(percentInput);
    partGroup.appendChild(percentSymbol);
    partGroup.appendChild(partsContainer);
    
    // Append part group to container
    container.appendChild(partGroup);

    partGroupNameInput.value = "";

}

function createPartField() {
    var partField = document.createElement("div");
    partField.classList.add("part");

    var partNameInput = document.createElement("input");
    partNameInput.type = "text";
    partNameInput.name = "partName[]";
    partNameInput.placeholder = "Part Name";

    var partQuantityInput = document.createElement("input");
    partQuantityInput.type = "number";
    partQuantityInput.name = "partQuantity[]";
    partQuantityInput.placeholder = "Quantity";

    var partSqInchesInput = document.createElement("input");
    partSqInchesInput.type = "number";
    partSqInchesInput.step = "any";
    partSqInchesInput.name = "partSqInches[]";
    partSqInchesInput.placeholder = "Square Inches";

    var deletePartButton = document.createElement("button");
    deletePartButton.textContent = "Delete Part";
    deletePartButton.addEventListener("click", function() {
        partField.parentElement.removeChild(partField); // Remove the part field
    });

    partField.appendChild(partNameInput);
    partField.appendChild(partQuantityInput);
    partField.appendChild(partSqInchesInput);
    partField.appendChild(deletePartButton);

    return partField;
}

function addPart(event) {
    event.preventDefault();
    var partsContainer = event.target.parentElement.querySelector(".partsContainer");
    partsContainer.appendChild(createPartField());
}

function updateMaterialDensity() {
    var materialSelect = document.getElementById("stock_material");
    var densityInput = document.getElementById("material_density");
    var material = materialSelect.value;

    // Set default density values for each material
    switch(material) {
        case "stainless_steel":
            densityInput.value = 0.29;
            break;
        case "aluminum":
            densityInput.value = 0.098;
            break;
        case "steel":
            densityInput.value = 0.28;
            break;
        case "bronze":
            densityInput.value = 0.34;
            break;
        case "custom":
            densityInput.value = ""; // Clear the value for custom material
            break;
        default:
            densityInput.value = ""; // Clear the value if the material is not recognized
            break;
    }
}
