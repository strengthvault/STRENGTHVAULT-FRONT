import axios from 'axios';

async function getOEmbed(videoUrl) {
    try {
        const response = await fetch(`https://strengthvault-api.vercel.app/api/oembed`, {
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
  return fetch('https://strengthvault-api.vercel.app/api/blogs', {  // Cambia la URL por la correcta si es diferente
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
async function findByVideoId(userId, videoId) {
    console.log(userId, videoId)
    return fetch(`https://strengthvault-api.vercel.app/api/blogs/${userId}/${videoId}`, {
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

const createBlogWithVideo = async (formData) => {
    try {
        const response = await axios.post('https://strengthvault-api.vercel.app/api/blogs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear el blog con video:', error);
        throw error;
    }
};

// Crea una noticia
async function createVideo(blogData) {
    try {
      const response = await fetch('https://strengthvault-api.vercel.app/api/blogs/upload', {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la noticia');
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error en la solicitud:', error.message);
      throw error;
    }
  }


//Editar un día

async function editVideo(id, blog) {
    return fetch(`https://strengthvault-api.vercel.app/api/blogs/${id}`, {
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
    return fetch(`https://strengthvault-api.vercel.app/api/blogs/${id}`, {
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
    deleteVideo,
    createBlogWithVideo
 }