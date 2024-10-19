async function login(username, password) {
    return fetch('https://strengthvault-api.vercel.app/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            // Captura el error si el servidor devuelve un error de estado
            return response.json().then(err => {
                throw new Error(err.message || 'Error al iniciar sesión');
            });
        }
    })
    .catch(err => {
        // Muestra el error capturado en la consola o en la interfaz
        console.error('Error en la solicitud:', err.message);
        // Aquí puedes devolver el error o hacer algo con él en la interfaz
        return { error: err.message };
    });
}




async function logout() {
    return fetch('https://strengthvault-api.vercel.app/api/logout', {
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
    return fetch(`https://strengthvault-api.vercel.app/api/users/`, {
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
    return fetch('https://strengthvault-api.vercel.app/api/users/register', {
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

    return fetch(`https://strengthvault-api.vercel.app/api/users/${id}`, {
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
    return fetch(`https://strengthvault-api.vercel.app/api/users/${userId}/access`, {
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