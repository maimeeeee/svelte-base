<script lang="ts">
  import { confetti } from '@neoconfetti/svelte'
  import { reduced_motion } from './reduced-motion'
  import type { PageData, ActionData } from './$types'
  import { enhance } from '$app/forms'

  export let data: PageData

  export let form: ActionData

  /** Whether or not the user has won */
  $: won = data.answers.at(-1) === 'xxxxx'

  /** The index of the current guess */
  $: i = won ? -1 : data.answers.length

  /** Whether the current guess can be submitted */
  $: submittable = data.guesses[i]?.length === 5

  /**
   * A map of classnames for all letters that have been guessed,
   * used for styling the keyboard
   */
  let classnames: Record<string, 'exact' | 'close' | 'missing'>

  /**
   * A map of descriptions for all letters that have been guessed,
   * used for adding text for assistive technology (e.g. screen readers)
   */
  let description: Record<string, string>

  $: {
    classnames = {}
    description = {}

    data.answers.forEach((answer, i) => {
      const guess = data.guesses[i]

      for (let i = 0; i < 5; i += 1) {
        const letter = guess[i]

        if (answer[i] === 'x') {
          classnames[letter] = 'exact'
          description[letter] = 'correct'
        } else if (!classnames[letter]) {
          classnames[letter] = answer[i] === 'c' ? 'close' : 'missing'
          description[letter] = answer[i] === 'c' ? 'present' : 'absent'
        }
      }
    })
  }

  /**
   * Modify the game state without making a trip to the server,
   * if client-side JavaScript is enabled
   */
  function update(event: MouseEvent) {
    const guess = data.guesses[i]
    const key = (event.target as HTMLButtonElement).getAttribute('data-key')

    if (key === 'backspace') {
      data.guesses[i] = guess.slice(0, -1)
      if (form?.badGuess) form.badGuess = false
    } else if (guess.length < 5) {
      data.guesses[i] += key
    }
  }

  /**
   * Trigger form logic in response to a keydown event, so that
   * desktop users can use the keyboard to play the game
   */
  function keydown(event: KeyboardEvent) {
    if (event.metaKey) return

    document
      .querySelector(`[data-key="${event.key}" i]`)
      ?.dispatchEvent(new MouseEvent('click', { cancelable: true }))
  }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
  <title>Sverdle</title>
  <meta name="description" content="A Wordle clone written in SvelteKit" />
</svelte:head>

<h1 class="visually-hidden">Sverdle</h1>

<form
  method="POST"
  action="?/enter"
  use:enhance={() => {
    // prevent default callback from resetting the form
    return ({ update }) => {
      update({ reset: false })
    }
  }}
>
  <a class="how-to-play" href="/sverdle/how-to-play">How to play</a>

  <div class="grid" class:playing={!won} class:bad-guess={form?.badGuess}>
    {#each Array(6) as _, row}
      {@const current = row === i}
      <h2 class="visually-hidden">Row {row + 1}</h2>
      <div class="row" class:current>
        {#each Array(5) as _, column}
          {@const answer = data.answers[row]?.[column]}
          {@const value = data.guesses[row]?.[column] ?? ''}
          {@const selected = current && column === data.guesses[row].length}
          {@const exact = answer === 'x'}
          {@const close = answer === 'c'}
          {@const missing = answer === '_'}
          <div class="letter" class:exact class:close class:missing class:selected>
            {value}
            <span class="visually-hidden">
              {#if exact}
                (correct)
              {:else if close}
                (present)
              {:else if missing}
                (absent)
              {:else}
                empty
              {/if}
            </span>
            <input name="guess" disabled={!current} type="hidden" {value} />
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div class="controls">
    {#if won || data.answers.length >= 6}
      {#if !won && data.answer}
        <p>the answer was "{data.answer}"</p>
      {/if}
      <button data-key="enter" class="restart selected" formaction="?/restart">
        {won ? 'you won :)' : 'game over :('} play again?
      </button>
    {:else}
      <div class="keyboard">
        <button data-key="enter" class:selected={submittable} disabled={!submittable}>enter</button>

        <button
          on:click|preventDefault={update}
          data-key="backspace"
          formaction="?/update"
          name="key"
          value="backspace"
        >
          back
        </button>

        {#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row}
          <div class="row">
            {#each row as letter}
              <button
                on:click|preventDefault={update}
                data-key={letter}
                class={classnames[letter]}
                disabled={data.guesses[i].length === 5}
                formaction="?/update"
                name="key"
                value={letter}
                aria-label="{letter} {description[letter] || ''}"
              >
                {letter}
              </button>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</form>

{#if won}
  <div
    style="position: absolute; top: 30%; left: 50%"
    use:confetti={{
      particleCount: $reduced_motion ? 0 : undefined,
      force: 0.7,
      stageWidth: window.innerWidth,
      stageHeight: window.innerHeight,
      colors: ['#ff3e00', '#40b3ff', '#676778'],
    }}
  />
{/if}

<style>
  form {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .how-to-play {
    color: var(--color-text);
  }

  .how-to-play::before {
    position: relative;
    top: -0.05em;
    display: inline-block;
    width: 1em;
    height: 1em;
    padding: 0.2em;
    margin: 0 0.5em 0 0;
    font-size: 0.8em;
    font-weight: 900;
    line-height: 1;
    text-align: center;
    content: 'i';
    border: 1.5px solid var(--color-text);
    border-radius: 50%;
  }

  .grid {
    --width: min(100vw, 40vh, 380px);

    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: flex-start;
    justify-self: center;
    width: 100%;
    max-width: var(--width);
    height: 100%;
  }

  .grid .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 0.2rem;
    margin: 0 0 0.2rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    .grid.bad-guess .row.current {
      animation: wiggle 0.5s;
    }
  }

  .grid.playing .row.current {
    filter: drop-shadow(3px 3px 10px var(--color-bg-0));
  }

  .letter {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1;
    margin: 0;
    font-size: calc(0.08 * var(--width));
    color: rgb(0 0 0 / 70%);
    text-align: center;
    text-transform: lowercase;
    background: white;
    border: none;
    border-radius: 2px;
  }

  .letter.missing {
    color: rgb(0 0 0 / 50%);
    background: rgb(255 255 255 / 50%);
  }

  .letter.exact {
    color: white;
    background: var(--color-theme-2);
  }

  .letter.close {
    border: 2px solid var(--color-theme-2);
  }

  .selected {
    outline: 2px solid var(--color-theme-1);
  }

  .controls {
    justify-content: center;
    height: min(18vh, 10rem);
    text-align: center;
  }

  .keyboard {
    --gap: 0.2rem;

    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    height: 100%;
  }

  .keyboard .row {
    display: flex;
    flex: 1;
    gap: 0.2rem;
    justify-content: center;
  }

  .keyboard button,
  .keyboard button:disabled {
    --size: min(8vw, 4vh, 40px);

    width: var(--size);
    margin: 0;
    font-size: calc(var(--size) * 0.5);
    color: black;
    background-color: white;
    border: none;
    border-radius: 2px;
  }

  .keyboard button.exact {
    color: white;
    background: var(--color-theme-2);
  }

  .keyboard button.missing {
    opacity: 0.5;
  }

  .keyboard button.close {
    border: 2px solid var(--color-theme-2);
  }

  .keyboard button:focus {
    color: white;
    background: var(--color-theme-1);
    outline: none;
  }

  .keyboard button[data-key='enter'],
  .keyboard button[data-key='backspace'] {
    position: absolute;
    bottom: 0;
    width: calc(1.5 * var(--size));
    height: calc(1 / 3 * (100% - 2 * var(--gap)));
    padding-top: calc(0.15 * var(--size));
    font-size: calc(0.3 * var(--size));
    text-transform: uppercase;
  }

  .keyboard button[data-key='enter'] {
    right: calc(50% + 3.5 * var(--size) + 0.8rem);
  }

  .keyboard button[data-key='backspace'] {
    left: calc(50% + 3.5 * var(--size) + 0.8rem);
  }

  .keyboard button[data-key='enter']:disabled {
    opacity: 0.5;
  }

  .restart {
    width: 100%;
    padding: 1rem;
    background: rgb(255 255 255 / 50%);
    border: none;
    border-radius: 2px;
  }

  .restart:focus,
  .restart:hover {
    color: white;
    background: var(--color-theme-1);
    outline: none;
  }

  @keyframes wiggle {
    0% {
      transform: translateX(0);
    }

    10% {
      transform: translateX(-2px);
    }

    30% {
      transform: translateX(4px);
    }

    50% {
      transform: translateX(-6px);
    }

    70% {
      transform: translateX(+4px);
    }

    90% {
      transform: translateX(-2px);
    }

    100% {
      transform: translateX(0);
    }
  }
</style>
