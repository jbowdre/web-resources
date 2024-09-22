/* retrieves the latest link from a musicthread thread and displays it on the page
  Params:
    id: the thread ID (required)
    plain: return info in a single unstyled line without album art (optional)
*/
const themeSongScript = document.currentScript
const urlParams = new URLSearchParams(themeSongScript.src.split('.js')[1])
const params = Object.fromEntries(urlParams.entries())

if (params.id)
{
  const musicthread = `https://musicthread.app/api/v0/thread/${params.id}`
  fetch(musicthread)
  .then((response) => response.json())
  .then((thread) => {
    let themeSong = thread.links[0]
    console.log(themeSong)
    themeSongContainer = document.createElement('div')
    themeSongContainer.className = 'theme-song'

    const plain = params.plain === 'true'
    let innerHTML = ''
    if (plain) {
      innerHTML = `<a href="${themeSong.page_url}">${themeSong.title}</a> by ${themeSong.artist}`
    } else {
      innerHTML = `<a href="${themeSong.page_url}"><img src="${themeSong.thumbnail_url}" alt="Album art for ${themeSong.title} by ${themeSong.artist}" title="Album art for ${themeSong.title} by ${themeSong.artist}"></a><br><a href="${themeSong.page_url}"><strong>${themeSong.title}</strong></a><br>${themeSong.artist}`
    }

    themeSongContainer.innerHTML = innerHTML
    themeSongScript.parentNode.insertBefore(themeSongContainer, themeSongScript)
  })
}