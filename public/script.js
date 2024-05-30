let global_id;

document.addEventListener('DOMContentLoaded', () => {
    let counter = 0;

    const form = document.getElementById('signupForm');

    form.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        if (!name || !email) {
            alert('Please fill in all fields');
            return;
        }

        if (global_id) {
            fetch(`/updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: global_id,
                    name: name,
                    email: email
                })
            })

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        } else {

            try {
                const response = await fetch('/sign_up', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email })
                });

                if (response.ok) {
                    alert('Record Added succesfully')
                    document.getElementById('name').value="";
                    document.getElementById('email').value="";
                } else {
                    console.error('Error:', response.statusText);
                    alert('Record Not Added')
                }
            } catch (err) {
                console.error('Error:', err);
            }
        }
    });

    let showDataBtn = document.getElementById('showData');

    showDataBtn.addEventListener('click', () => {
        fetch("/users")
            .then(res => res.json())
            .then(data => {
                const container = document.querySelector(".container");

                data.forEach(user => {
                    counter++;
                    const div = document.createElement("div");
                    div.textContent = counter + ": Name: " + user.name + ", Email: " + user.email;
                    div.innerHTML += `
                    <br>
                    <button onclick="updateData('${user._id}','${user.name}','${user.email}')">Update</button>
                    <button onclick="deleteItem('${user._id}')">Delete</button>
                    `
                    container.appendChild(div);
                });
                showDataBtn.style.display = "none"
            })
            .catch(error => console.error("Error fetching user data:", error));
    });
});

function updateData(_id, name, email) {
    let nameInput = document.querySelector('#name')
    let emailInput = document.querySelector('#email')

    nameInput.value = name;
    emailInput.value = email;
    global_id = _id;
}


function deleteItem(_id) {
    fetch(`/deleteUser/${_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
}

