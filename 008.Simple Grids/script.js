const collections = () => {
  return fetch("data.json")
    .then((response) => response.json())
    .then((datas) => {
      return { error: null, datas };
    })
    .catch((error) => {
      return error.message, [];
    });
};

const Collection_item = (index, payload) => {
  const { collection_id, name, description, image_url, created_at } = payload;


  const _img = document.createElement("img");
  _img.src = image_url;
  _img.setAttribute("alt", `${name} image collection`);
  _img.classList.add("collection-img");

  const _name = document.createElement("h3");
  _name.innerText = name;
  _name.classList.add("collection-name");

  const _description = document.createElement("p");
  _description.innerText = description;
  _description.classList.add("collection-description");


  const _container_info = document.createElement("div");
  _container_info.classList.add("collection-info");
  _container_info.append(_name, _description);


  const _container_item = document.createElement("div");
  _container_item.setAttribute("id", collection_id);
  _container_item.classList.add("collection");
  _container_item.classList.add(index === 0 ? "primary" : "secondary");

  _container_item.append(_img, _container_info);

  return _container_item;
};

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("root");
  const _container_section = document.createElement("section");
  _container_section.classList.add("container");

  const _collections = document.createElement("div");
  _collections.classList.add("collections");

  const _title_section = document.createElement("h2");
  _title_section.innerText = "Our Collections";

  _container_section.append(_title_section, _collections);

  const { error, datas } = await collections();
  datas.forEach((data, index) => {
    _collections.append(Collection_item(index, data));
  });

  root.append(_container_section);
});