async function login(username, password) {
    return fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(async response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw Error('La contraseña o el email son incorrectos. Por favor ingrese una cuenta válida.')
            }
        })
}



async function logout() {
    return fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    })

        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error('No se pudo cerrar sesión')
            }
        })
}

async function getAllUsers() {
    return fetch(`http://localhost:3000/api/users/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(async response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw Error('La contraseña o el email son incorrectos. Por favor ingrese una cuenta válida.')
            }
        })
}

export async function register(username, email, password ) {
    console.log(username, email, password)
    return fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password })
    })
        .then(async response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error('Error al registrarse. Por favor intente de nuevo.');
            }
        });
  }
  
  export async function deleteUser(id) {

    return fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },

    })
        .then(async response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error('Error al registrarse. Por favor intente de nuevo.');
            }
        });
  }

  async function updateUser(userId, data) {
    return fetch(`http://localhost:3000/api/users/${userId}/access`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw Error('Error al actualizar el usuario.');
        }
    });
}

export {
    login,
    logout,
    getAllUsers,
    updateUser
}