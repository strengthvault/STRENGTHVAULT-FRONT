// frontend/components/VideoEmbed.js

import React, { useEffect, useState } from 'react';
import videosServices from '../services/videos.services';

function VideoEmbed({ videoUrl }) {
    const [embedHtml, setEmbedHtml] = useState('');

    useEffect(() => {
        async function getEmbedHtml() {
            try {
                const html = await videosServices.getOEmbed(videoUrl);
                setEmbedHtml(html);
            } catch (error) {
                console.error('Error al cargar oEmbed:', error);
            }
        }

        getEmbedHtml();
    }, [videoUrl]);

    return (
        <div
            className="video-embed"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
        />
    );
}

export default VideoEmbed;
