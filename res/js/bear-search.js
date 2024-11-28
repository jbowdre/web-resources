/* adds search capability to a Bear blog (https://bearblog.dev)

  from https://github.com/Froodooo/bear-plugins/blob/f1d30488b138b0bf6d9a8e78bd6355daa7876688/bear/blog-search.js
*/

if (document.querySelector(".blog-posts") && document.body.classList.contains("blog")) {
  document.querySelector("main").insertBefore(
    Object.assign(
      document.createElement("input"), {
      type: "text",
      id: "searchInput",
      placeholder: "Search...",
      style: "display: block;",
      oninput: (event) => {
        document.querySelectorAll(".blog-posts li").forEach((post) => {
          post.style.display = post.textContent.toLowerCase().includes(event.target.value.toLowerCase()) ? "" : "none";
        })
      }
    }),
    document.querySelector(".blog-posts")
  );
}