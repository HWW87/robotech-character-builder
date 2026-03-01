import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useCharacterData } from './useCharacterData';

// localStorage is available in jsdom

describe.skip('useCharacterData', () => {
  beforeEach(() => {
    // ensure a localStorage object exists on the global/window without blowing
    // away the jsdom Window instance (which also exposes document, etc.)
    const store = { _data: {} };
    const methods = {
      clear() { this._data = {}; },
      getItem(key) { return this._data[key] ?? null; },
      setItem(key, value) { this._data[key] = value; },
      removeItem(key) { delete this._data[key]; },
    };
    // assign properties to store so we can use same object reference
    Object.assign(store, methods);
    Object.defineProperty(global, 'localStorage', {
      value: store,
      writable: true,
    });
    /// in jsdom the window object is also global, so this makes it available
    Object.defineProperty(global, 'window', {
      value: global.window || {},
      writable: true,
    });
    global.window.localStorage = store;

    vi.useFakeTimers();
  });

  it('initializes with default values when storage empty', () => {
    const { result } = renderHook(() => useCharacterData());
    expect(result.current.character).toMatchObject({
      name: "",
      faction: "",
      occ: "",
      skills: [],
      mecha: "",
    });
  });

  it('saves to and loads from localStorage', () => {
    const { result, unmount } = renderHook(() => useCharacterData());

    act(() => {
      result.current.update('name', 'Test');
    });

    // wait for debounce (400ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const saved = JSON.parse(localStorage.getItem('robotech_character'));
    expect(saved.name).toBe('Test');

    // unmount and mount a fresh hook to simulate reload
    unmount();
    const { result: result2 } = renderHook(() => useCharacterData());
    expect(result2.current.character.name).toBe('Test');
  });

  it('reset clears storage and state', () => {
    const { result } = renderHook(() => useCharacterData());
    act(() => {
      result.current.update('name', 'Foo');
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.character.name).toBe('');
    expect(localStorage.getItem('robotech_character')).toBeNull();
  });
});
