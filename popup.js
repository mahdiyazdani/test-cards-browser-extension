document.addEventListener('DOMContentLoaded', async function () {
	var gatewaySelect = document.getElementById('gatewaySelect');
	var cardTable = document.getElementById('cardTable');

	// Load card numbers from JSON file
	try {
		var data = await loadCardNumbers();
		// Populate the payment gateway dropdown
		Object.keys(data).forEach(function (gateway) {
			var option = document.createElement('option');
			option.value = gateway;
			option.textContent = gateway;
			gatewaySelect.appendChild(option);
		});
	} catch (error) {
		console.error('Failed to load card numbers: ' + error);
	}

	gatewaySelect.addEventListener('change', async function () {
		var selectedGateway = gatewaySelect.value;

		// Hide the table if no item is selected
		if (!selectedGateway) {
			cardTable.style.display = 'none';
			return;
		}

		// Clear previous card numbers
		clearTable();

		// Load card numbers from JSON file
		try {
			var cardNumbers = data[selectedGateway];
			if (cardNumbers) {
				// Add new card numbers to the table
				cardNumbers.forEach(function (cardNumber) {
					addCardToTable(cardNumber.label, cardNumber.number);
				});

				// Show the table
				cardTable.style.display = 'table';
			} else {
				// Hide the table if no card numbers are available
				cardTable.style.display = 'none';
			}
		} catch (error) {
			console.error('Failed to load card numbers: ' + error);
		}
	});

	async function loadCardNumbers() {
		var response = await fetch('cardNumbers.json');
		if (!response.ok) {
			throw new Error('Failed to load card numbers');
		}
		return await response.json();
	}

	function clearTable() {
		while (cardTable.rows.length > 1) {
			cardTable.deleteRow(1);
		}
	}

	function addCardToTable(brand, number) {
		var row = cardTable.insertRow();
		var brandCell = row.insertCell();
		var numberCell = row.insertCell();

		brandCell.textContent = brand;
		numberCell.textContent = number;

		row.addEventListener('click', function () {
			copyToClipboard(number);
		});
	}

	function copyToClipboard(text) {
		navigator.clipboard
			.writeText(text)
			.then(function () {
				console.log('Text copied to clipboard: ' + text);
				alert('Copied to clipboard: ' + text);
			})
			.catch(function (error) {
				console.error('Failed to copy text to clipboard: ' + error);
			});
	}
});
