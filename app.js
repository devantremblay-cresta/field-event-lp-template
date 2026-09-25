(function () {
  const ev = window.EVENT;
  const $ = (sel) => document.querySelector(sel);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function photo(src, alt, placeholder) {
    if (src) {
      const img = el('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      return img;
    }
    return el('div', 'placeholder', placeholder);
  }

  document.title = ev.pageTitle;
  $('#header-meta').textContent = ev.headerMeta;
  $('#guest-count').textContent = `${ev.guests.length} guests`;
  $('#title').textContent = ev.title;

  const details = $('#details');
  ev.details.forEach((d) => {
    const item = el('div', 'detail');
    item.append(el('span', 'label mono', d.label));
    const value = el('span', 'value');
    d.lines.forEach((line, i) => {
      if (i) value.append(el('br'));
      value.append(line);
    });
    if (d.link) {
      value.append(el('br'));
      const a = el('a', null, d.link.text);
      a.href = d.link.href;
      a.target = '_blank';
      a.rel = 'noopener';
      value.append(a);
    }
    item.append(value);
    details.append(item);
  });

  if (ev.showHosts) {
    $('#hosts-label').textContent = ev.hostsLabel;
    const list = $('#host-list');
    ev.hosts.forEach((h) => {
      const host = el('div', 'host');
      const avatar = el('div', 'avatar');
      avatar.append(photo(h.photo, h.name, 'Photo'));
      const text = el('div', 'host-text');
      text.append(el('span', 'name', h.name), el('span', 'title', h.title));
      host.append(avatar, text);
      list.append(host);
    });
  } else {
    $('#hosts').remove();
  }

  $('#guests-heading').textContent = ev.guestsHeading;
  const grid = $('#guest-grid');
  ev.guests.forEach((g) => {
    const card = el('div', 'guest');
    const frame = el('div', 'photo');
    frame.append(photo(g.photo, g.name, 'Guest photo'));
    const text = el('div', 'guest-text');
    text.append(
      el('span', 'name', g.name),
      el('span', 'title', g.title),
      el('span', 'company', g.company)
    );
    card.append(frame, text);
    grid.append(card);
  });

  const mail = $('#contact-email');
  mail.textContent = ev.contactEmail;
  mail.href = `mailto:${ev.contactEmail}`;
})();
