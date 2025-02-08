function createPagination(totalPages, currentPage = 1, ellipse = false) {
  const container = document.getElementById('pagination');
  const ul = document.createElement('ul');
  
  let prePage = Math.max(2, currentPage - 1);
  let nextPage = Math.min(totalPages - 1, currentPage + 1);
  
  ul.className = 'pagination';

  if (currentPage > 1) {
    appendItem(ul, currentPage - 1, '←');
  }

  appendItem(ul, 1, '1', currentPage === 1);

  if (ellipse) {
    if (prePage > 2) {
      appendDots(ul);
    }

    if (nextPage < totalPages - 1) {
      appendDots(ul);
    }
    
  }

  for (let i = prePage; i <= nextPage; i++) {
    appendItem(ul, i, i.toString(), currentPage === i);
  }

 

  if (totalPages > 1) {
    appendItem(ul, totalPages, totalPages.toString(), currentPage === totalPages);
  }

  if (currentPage < totalPages) {
    appendItem(ul, currentPage + 1, '→');
  }

  container.innerHTML = '';
  container.appendChild(ul);
}

function appendItem(ul, pageNum, text, isActive = false) {
  const li = document.createElement('li');
  const a = document.createElement('a');

  li.className = `page-item ${isActive ? 'active' : ''}`;
  a.href = '#';
  a.textContent = text;

  a.onclick = (e) => {
    e.preventDefault();
    createPagination(totalPages, pageNum);
    console.log('Page changed to:', pageNum);
  };

  li.appendChild(a);
  ul.appendChild(li);
}

function appendDots(ul, href) {
  const li = document.createElement('li');
  li.className = 'page-item dots';
  li.textContent = '...';
  ul.appendChild(li);
}

const totalPages = 300;
createPagination(totalPages);