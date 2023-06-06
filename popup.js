document.addEventListener('DOMContentLoaded', async function () {
	const $gatewaySelect = document.getElementById('gatewaySelect');
	const $cardTable = document.getElementById('cardTable');
	const $cardNumbers = document.getElementById('cardNumbers');
	let data;

	// Load card numbers from JSON file
	try {
		data = await loadCardNumbers();
		// Populate the payment gateway dropdown
		Object.keys(data).forEach(function (gateway) {
			const option = document.createElement('option');
			option.value = gateway;
			option.textContent = gateway;
			$gatewaySelect.appendChild(option);
		});
	} catch (error) {
		console.error('Failed to load card numbers: ' + error);
	}

	$gatewaySelect.addEventListener('change', async function () {
		const selectedGateway = $gatewaySelect.value;

		// Hide the table if no item is selected
		if (!selectedGateway) {
			$cardTable.style.display = 'none';
			return;
		}

		// Clear previous card numbers
		clearTable();

		// Load card numbers from JSON file
		try {
			const cardNumbers = data[selectedGateway];
			if (cardNumbers) {
				// Add new card numbers to the table
				cardNumbers.forEach(function (cardNumber) {
					addCardToTable(cardNumber.label, cardNumber.number);
				});

				// Show the table
				$cardTable.style.display = 'table';
			} else {
				// Hide the table if no card numbers are available
				$cardTable.style.display = 'none';
			}
		} catch (error) {
			console.error('Failed to load card numbers: ' + error);
		}
	});

	async function loadCardNumbers() {
		const response = await fetch('cardNumbers.json');
		if (!response.ok) {
			throw new Error('Failed to load card numbers');
		}
		return await response.json();
	}

	function clearTable() {
		$cardNumbers.innerHTML = '';
	}

	function addCardToTable(brand, number) {
		const row = $cardNumbers.insertRow();
		const brandCell = row.insertCell();
		const numberCell = row.insertCell();

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
				window.close();
			})
			.catch(function (error) {
				console.error('Failed to copy text to clipboard: ' + error);
			});
	}
});
