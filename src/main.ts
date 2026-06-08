import './style.css';

type Message = {
  id: number;
  author: string;
  body: string;
  createdAt: string;
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app element');
}

app.innerHTML = `
  <section class="shell">
    <p class="eyebrow">Void + Vite + D1</p>
    <h1>Void 数据库 Demo</h1>
    <p class="lead">
      这个页面会调用 <code>routes/api/messages.ts</code>，通过
      <code>void/db</code> 读写 Void 默认托管的 Cloudflare D1。
    </p>
    <form id="message-form" class="message-form">
      <label>
        昵称
        <input id="author" name="author" maxlength="40" placeholder="Anonymous" />
      </label>
      <label>
        留言
        <textarea id="body" name="body" maxlength="240" rows="4" required placeholder="写一条留言"></textarea>
      </label>
      <button id="submit" type="submit">保存到 D1</button>
    </form>
    <div class="toolbar">
      <button id="refresh" type="button">刷新列表</button>
    </div>
    <ul id="messages" class="messages"></ul>
    <pre id="status">等待请求...</pre>
  </section>
`;

const form = document.querySelector<HTMLFormElement>('#message-form');
const status = document.querySelector<HTMLPreElement>('#status');
const refreshButton = document.querySelector<HTMLButtonElement>('#refresh');
const submitButton = document.querySelector<HTMLButtonElement>('#submit');
const list = document.querySelector<HTMLUListElement>('#messages');
const authorInput = document.querySelector<HTMLInputElement>('#author');
const bodyInput = document.querySelector<HTMLTextAreaElement>('#body');

function setBusy(isBusy: boolean) {
  if (refreshButton) refreshButton.disabled = isBusy;
  if (submitButton) submitButton.disabled = isBusy;
}

function renderMessages(messages: Message[]) {
  if (!list) return;

  if (messages.length === 0) {
    list.innerHTML = '<li class="empty">数据库里还没有留言。</li>';
    return;
  }

  list.innerHTML = messages
    .map(
      (message) => `
        <li>
          <div class="message-meta">
            <strong>${escapeHtml(message.author)}</strong>
            <time>${escapeHtml(message.createdAt)}</time>
          </div>
          <p>${escapeHtml(message.body)}</p>
        </li>
      `,
    )
    .join('');
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return entities[char];
  });
}

async function loadMessages() {
  if (!status) return;

  setBusy(true);
  status.textContent = '读取 D1 数据中...';

  try {
    const response = await fetch('/api/messages');
    const data = (await response.json()) as Message[];

    if (!response.ok) {
      throw new Error(JSON.stringify(data, null, 2));
    }

    renderMessages(data);
    status.textContent = JSON.stringify({ count: data.length }, null, 2);
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    setBusy(false);
  }
}

async function createMessage(event: SubmitEvent) {
  event.preventDefault();

  if (!status || !bodyInput) return;

  setBusy(true);
  status.textContent = '写入 D1 数据中...';

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: authorInput?.value,
        body: bodyInput.value,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data, null, 2));
    }

    bodyInput.value = '';
    status.textContent = JSON.stringify(data, null, 2);
    await loadMessages();
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    setBusy(false);
  }
}

form?.addEventListener('submit', createMessage);
refreshButton?.addEventListener('click', loadMessages);
void loadMessages();
