document.addEventListener("DOMContentLoaded", () => {
        function addPlayerField() {
            const container = document.getElementById('playersContainer');
            const div = document.createElement('div');
            div.classList.add('player-entry');
            div.innerHTML = `
                <input type="text" name="players[][name]" placeholder="Player Name" required>
                <input type="number" name="players[][number]" placeholder="Number" required>
                <input type="number" name="players[][additionalPrice]" placeholder="Extra Price" step="0.01" required>
                <button type="button" onclick="this.parentElement.remove()">Remove</button>
            `;
            container.appendChild(div);
        }

        document.querySelector('select[name="category"]').addEventListener('change', function () {
            document.querySelectorAll('.category-fields').forEach(el => el.classList.add('hidden'));
            if (this.value === 'kits') {
                document.getElementById('kitFields').classList.remove('hidden');
            }
        });
        
    document.querySelector('select[name="category"]').addEventListener('change', function () {
        document.querySelectorAll('.category-fields').forEach(el => el.classList.add('hidden'));

        if (this.value === 'kits') {
            document.getElementById('kitFields').classList.remove('hidden');
        } else if (this.value === 'boots') {
            document.getElementById('bootFields').classList.remove('hidden');
        }
    });
});