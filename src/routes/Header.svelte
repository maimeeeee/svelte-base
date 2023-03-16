<script>
  import { page } from '$app/stores'
  import logo from '$lib/images/svelte-logo.svg'
  import github from '$lib/images/github.svg'
</script>

<header>
  <div class="corner">
    <a href="https://kit.svelte.dev">
      <img src={logo} alt="SvelteKit" />
    </a>
  </div>

  <nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
        <a href="/">Home</a>
      </li>
      <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
        <a href="/about">About</a>
      </li>
      <li aria-current={$page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
        <a href="/sverdle">Sverdle</a>
      </li>
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>

  <div class="corner">
    <a href="https://github.com/sveltejs/kit">
      <img src={github} alt="GitHub" />
    </a>
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  nav a {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-text);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: color 0.2s linear;
  }

  nav {
    display: flex;
    justify-content: center;

    --background: rgb(255 255 255 / 70%);
  }

  .corner {
    width: 3em;
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  svg {
    display: block;
    width: 2em;
    height: 3em;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3em;
    padding: 0;
    margin: 0;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li[aria-current='page']::before {
    --size: 6px;

    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    width: 0;
    height: 0;
    content: '';
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  }

  a:hover {
    color: var(--color-theme-1);
  }
</style>
