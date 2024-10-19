async function getOEmbed(videoUrl) {
    try {
        const response = await fetch(`http://localhost:3000/api/oembed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl }),  // Enviar la URL en el cuerpo de la solicitud
        });

        if (!response.ok) {
            const errorMessage = `Error al obtener el oEmbed: ${response.status} ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.html;  // Retorna el HTML oEmbed
    } catch (error) {
        console.error('Error en getOEmbed:', error.message);
        throw error;
    }
}



async function getVideos() {
  return fetch('http://localhost:3000/api/blogs', {  // Cambia la URL por la correcta si es diferente
      method: 'GET',
      headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
      }
  })
      .then(async response => {
          if (response.ok) {
              return response.json();
          } else {
              throw Error('No se pudieron obtener los blogs. Por favor intente de nuevo.');
          }
      })
}

//Busca una noticia por su ID
async function findByVideoId(id) {
    return fetch(`http://localhost:3000/api/blogs/${id}`, {
        method: 'GET',
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
                throw new Error('No se pudo obtener las rutinas')
            }
        })
}

// Crea una noticia
async function createVideo(blog) {

    try {
        const response = await fetch(`http://localhost:3000/api/blogs/upload`, {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blog),
        });

        if (!response.ok) {
            // Manejar el caso donde la respuesta no fue exitosa
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear la noticia');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        // Manejar errores de red, de parseo de JSON, o cualquier otro error aquí
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}


//Editar un día

async function editVideo(id, blog) {
    return fetch(`http://localhost:3000/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(blog)
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('No se pudo editar el dia')
        }
    })
}

//Eliminar un día por su ID
async function deleteVideo(id) {
    return fetch(`http://localhost:3000/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
    })
        .then(response => response.json())
}

export default { 
    getOEmbed,
    getVideos,
    findByVideoId,
    createVideo,
    editVideo,
    deleteVideo
 }