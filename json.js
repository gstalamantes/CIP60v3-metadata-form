
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('musicMetadataForm');
    const jsonOutput = document.getElementById('jsonOutput');

    document.getElementById('addArtist').addEventListener('click', () => addEntry('artistsContainer', 'artist-entry'));
    document.getElementById('addFeaturedArtist').addEventListener('click', () => addEntry('featuredArtistsContainer', 'featured-artist-entry'));
    document.getElementById('addAuthor').addEventListener('click', () => addEntry('authorsContainer', 'author-entry'));
    document.getElementById('addContributingArtist').addEventListener('click', () => addEntry('contributingArtistsContainer', 'contributing-artist-entry'));

   
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('addLink')) {
            addLink(e.target.closest('.dynamic-field'));
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        try {
            const jsonData = generateJSON();
            console.log("Raw JSON data:", jsonData);
            const cleanedJsonData = removeEmptyFields(jsonData);
            console.log("Cleaned JSON data:", cleanedJsonData);
            const jsonString = JSON.stringify(cleanedJsonData, null, 2);
            
           
            const windowFeatures = 'width=600,height=800,resizable=yes,scrollbars=yes';
            const popupWindow = window.open('', '_blank', windowFeatures);
            popupWindow.document.open();
            popupWindow.document.write(`
                <html>
                    <head>
                        <title>JSON Output</title>
                        <style>
                            body {
                                font-family: monospace;
                                white-space: pre;
                                width: fit-content
                            }

                            html {
                                height: 50vh
                                width: 50vh
                            }
                        </style>
                    </head>
                    <body contenteditable="true">${jsonString}</body>
                </html>
            `);
            popupWindow.document.close();
        } catch (error) {
            console.error("Error generating JSON:", error);
            alert("Error generating JSON. Please check the console for details.");
        }
    });

    function generateJSON() {
        const formData = new FormData(form);
        
        const jsonData = {
            "721": {
                [formData.get('policyId')]: {
                    [formData.get('assetName')]: {
                        name: formData.get('name'),
                        image: formData.get('image'),
                        music_metadata_version: 3,
                        version: 1,
                        release: {
                            publication_date: formData.get('publicationDate'),
                            release_date: formData.get('releaseDate'),
                            release_type: 'Single',
                            release_title: formData.get('releaseTitle'),
                            distributor: formData.get('distributor'),
                            visual_artist: formData.get('visualArtist'),
                            collection: formData.get('collection'),
                            series: formData.get('series'),
                            catalog: formData.get("catalogNumber")
                        },
                        files: [
                            {
                                name: formData.get('fileName'),
                                mediaType: formData.get('mediaType'),
                                src: formData.get('src'),
                                song: {
                                    song_title: formData.get('songTitle'),
                                    set: formData.get("songSet"),
                                    song_duration: formatDuration(formData.get('songDuration')),
                                    track_number: "1",
                                    artists: getArtists(),
                                    featured_artists: getFeaturedArtists(),
                                    authors: getAuthors(),
                                    mastering_engineer: formData.get('masteringEngineer'),
                                    mix_engineer: formData.get('mixEngineer'),
                                    recording_engineer: formData.get('recordingEngineer'),
                                    producer: formData.get('producer'),
                                    isrc: formData.get("isrc"),
                                    iswc: formData.get("iswc"),
                                    contributing_artists: getContributingArtists(),
                                    genres: formData.get('genres') ? formData.get('genres').split(',').map(g => g.trim()) : null,
                                    mood: formData.get('mood'),
                                    copyright: {
                                        master: "℗ " + formData.get('copyrightMaster'),
                                        composition: "© " + formData.get('copyrightComposition')
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };
    
        return jsonData;
    }
    
    function getArtists() {
        const artists = [];
        const container = document.getElementById('artistsContainer');
        const artistEntries = container.querySelectorAll('.artist-entry');
        
        artistEntries.forEach((entry) => {
            const name = entry.querySelector('input[name="artistName[]"]').value;
            if (name) {
                const isni = entry.querySelector('input[name="artistIsni[]"]').value;
                const linkNames = entry.querySelectorAll('input[name="artistLinkName[]"]');
                const linkUrls = entry.querySelectorAll('input[name="artistLinkUrl[]"]');
                
                const artistData = {};
                if (isni) {
                    artistData.isni = isni;
                }
                
                const links = {};
                for (let i = 0; i < linkNames.length; i++) {
                    if (linkNames[i].value && linkUrls[i].value) {
                        links[linkNames[i].value] = linkUrls[i].value;
                    }
                }
                if (Object.keys(links).length > 0) {
                    artistData.links = links;
                }
                
                if (Object.keys(artistData).length > 0) {
                    const artistEntry = {};
                    artistEntry[name] = artistData;
                    artists.push(artistEntry);
                } else {
                    artists.push(name);
                }
            }
        });
        
        return artists.length > 0 ? artists : null;
    }
    
    function getFeaturedArtists() {
        const featuredArtists = [];
        const container = document.getElementById('featuredArtistsContainer');
        const artistEntries = container.querySelectorAll('.featured-artist-entry');
        
        artistEntries.forEach((entry) => {
            const name = entry.querySelector('input[name="featuredArtistName[]"]').value;
            if (name) {
                const isni = entry.querySelector('input[name="featuredArtistIsni[]"]').value;
                const linkNames = entry.querySelectorAll('input[name="featuredArtistLinkName[]"]');
                const linkUrls = entry.querySelectorAll('input[name="featuredArtistLinkUrl[]"]');
                
                const artistData = {};
                if (isni) {
                    artistData.isni = isni;
                }
                
                const links = {};
                for (let i = 0; i < linkNames.length; i++) {
                    if (linkNames[i].value && linkUrls[i].value) {
                        links[linkNames[i].value] = linkUrls[i].value;
                    }
                }
                if (Object.keys(links).length > 0) {
                    artistData.links = links;
                }
                
                if (Object.keys(artistData).length > 0) {
                    const artistEntry = {};
                    artistEntry[name] = artistData;
                    featuredArtists.push(artistEntry);
                } else {
                    featuredArtists.push(name);
                }
            }
        });
        
        return featuredArtists.length > 0 ? featuredArtists : null;
    }
    
    function getAuthors() {
        const authors = [];
        const container = document.getElementById('authorsContainer');
        const authorEntries = container.querySelectorAll('.author-entry');
        
        authorEntries.forEach((entry) => {
            const name = entry.querySelector('input[name="authorName[]"]').value;
            if (name) {
                const ipi = entry.querySelector('input[name="authorIpi[]"]').value;
                const share = entry.querySelector('input[name="authorShare[]"]').value;
                
                const authorData = {};
                if (ipi) authorData.ipi = ipi;
                if (share) authorData.share = share;
                
                if (Object.keys(authorData).length > 0) {
                    const authorEntry = {};
                    authorEntry[name] = authorData;
                    authors.push(authorEntry);
                } else {
                    authors.push(name);
                }
            }
        });
        
        return authors.length > 0 ? authors : null;
    }
    
    function getContributingArtists() {
        const artists = [];
        const container = document.getElementById('contributingArtistsContainer');
        const artistEntries = container.querySelectorAll('.contributing-artist-entry');
        
        artistEntries.forEach((entry) => {
            const name = entry.querySelector('input[name="contributingArtistName[]"]').value;
            if (name) {
                const ipn = entry.querySelector('input[name="contributingArtistIpn[]"]').value;
                const role = entry.querySelector('input[name="contributingArtistRole[]"]').value;
                
                const artistData = {};
                if (ipn) artistData.ipn = ipn;
                if (role) artistData.role = role.split(',').map(r => r.trim());
                
                if (Object.keys(artistData).length > 0) {
                    const artistEntry = {};
                    artistEntry[name] = artistData;
                    artists.push(artistEntry);
                } else {
                    artists.push(name);
                }
            }
        });
        
        return artists.length > 0 ? artists : null;
    }

    function formatDuration(duration) {
        if (!duration) return null;
        const [minutes, seconds] = duration.split(':');
        return `PT${minutes}M${seconds}S`;
    }


    function addEntry(containerId, entryClass) {
        const container = document.getElementById(containerId);
        const newEntry = container.querySelector(`.${entryClass}`).cloneNode(true);
        newEntry.querySelectorAll('input').forEach(input => input.value = '');
       
        const linksDiv = newEntry.querySelector('.links');
        if (linksDiv) {
            const linkInputs = linksDiv.querySelectorAll('input');
            for (let i = 2; i < linkInputs.length; i++) {
                linksDiv.removeChild(linkInputs[i]);
            }
        }
        container.insertBefore(newEntry, container.lastElementChild);
    }

    function addLink(parentElement) {
        const linksDiv = parentElement.querySelector('.links');
        const newLinkName = document.createElement('input');
        const newLinkUrl = document.createElement('input');
        newLinkName.type = 'text';
        newLinkUrl.type = 'url';
        newLinkName.className = "linkName";
        newLinkUrl.className = "linkURL";
        newLinkName.name = linksDiv.querySelector('input[type="text"]').name;
        newLinkUrl.name = linksDiv.querySelector('input[type="url"]').name;
        newLinkName.placeholder = 'Link Name';
        newLinkUrl.placeholder = 'Link URL';
        linksDiv.appendChild(newLinkName);
        linksDiv.appendChild(newLinkUrl);
    }

    function removeEmptyFields(obj) {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                removeEmptyFields(obj[key]);
                if (Array.isArray(obj[key]) && obj[key].length === 0) {
                    delete obj[key];
                } else if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                }
            }
        }
        return obj;
    }
});
