import { Random } from '../../src';
import Trie from '../../src/data-structure/Trie/Trie';

describe('Trie test', () => {
  function getRandomWord(length: number) {
    return Random.getRandomString(Random.getRandomNumber(1, length));
  }

  function createRandomWords(size = 50) {
    const words: string[] = new Array(size);
    for (let i = 0; i < size; i++) {
      words[i] = getRandomWord(30);
    }
    return words;
  }
  test('Trie insert test', () => {
    const words = createRandomWords();
    const trie = new Trie();
    words.forEach(word => {
      trie.insert(word);
    });
  });

  test('Trie insert and startsWith test', () => {
    const words = createRandomWords();
    const trie = new Trie();
    words.forEach(word => {
      trie.insert(word);
      for (let i = 0; i < word.length; i++) {
        expect(trie.startsWith(word.slice(0, i))).toBeTruthy();
      }
      expect(trie.startsWith(word)).toBeTruthy();
    });
  });

  test('Trie insert and search test', () => {
    const words = createRandomWords();
    const trie = new Trie();
    words.forEach(word => {
      trie.insert(word);
      expect(trie.search(word)).toBeTruthy();
    });
  });

  test('Trie empty test', () => {
    const trie = new Trie();
    expect(trie.search('')).toBeFalsy();
    expect(trie.startsWith('')).toBeFalsy();
    expect(trie.search(getRandomWord(20))).toBeFalsy();
    expect(trie.startsWith(getRandomWord(10))).toBeFalsy();
  });

  test('Trie remove test', () => {
    const words = createRandomWords(1);
    const trie = new Trie();
    words.forEach(word => {
      trie.insert(word);
    });
    words.forEach((word) => {
      expect(trie.remove(word)).toBeTruthy();
    });

    words.forEach(word => {
      expect(trie.search(word)).toBeFalsy();
    });

    words.forEach(word => {
      for (let i = 1; i <= word.length; i++) {
        expect(trie.startsWith(word.slice(0, i))).toBeFalsy();
      }
    });

    expect(trie.getWordCount()).toBe(0);

    // 看一下符不符合我的要求
    // @ts-ignore
    // console.log(trie.root);
    // console.log(trie.getWordCount());
  });

  test('Trie insert, remove, search and startsWith test', () => {
    const trie = new Trie();
    trie.insert('a');
    trie.insert('ab');
    trie.insert('abc');
    trie.insert('abcd');
    expect(trie.getWordCount()).toBe(4);
    expect(trie.startsWith('abcd')).toBeTruthy();
    expect(trie.remove('a')).toBeTruthy();
    expect(trie.getWordCount()).toBe(3);
    expect(trie.remove('abc')).toBeTruthy();
    expect(trie.getWordCount()).toBe(2);
    expect(trie.remove('ab')).toBeTruthy();
    expect(trie.getWordCount()).toBe(1);
    expect(trie.startsWith('a')).toBeTruthy();
    expect(trie.startsWith('ab')).toBeTruthy();
    expect(trie.startsWith('abc')).toBeTruthy();
    expect(trie.startsWith('abcd')).toBeTruthy();
    trie.insert('bcda');
    expect(trie.remove('abcd')).toBeTruthy();
    expect(trie.getWordCount()).toBe(1);
    expect(trie.startsWith('bcda')).toBeTruthy();
    expect(trie.startsWith('abcd')).toBeFalsy();
    expect(trie.search('abcd')).toBeFalsy();
    expect(trie.search('bcda')).toBeTruthy();
    expect(trie.startsWith('bc')).toBeTruthy();
  });

  test('Trie forEach test', () => {
    const words = createRandomWords(1);
    const trie = new Trie();
    const map = new Map<string, number>();
    words.forEach(word => {
      trie.insert(word);
      map.set(word, (map.get(word) || 0) + 1);
    });
    trie.forEach((word) => {
      const count = map.get(word)!;
      expect(0 < count).toBeTruthy();
      if (0 == count - 1) {
        map.delete(word);
      } else {
        map.set(word, count - 1);
      }
    });
    expect(map.size).toBe(0);
  });

  test('Trie insert same word', () => {
    const trie = new Trie();
    const word = 'abc';
    const size = 10;
    for (let i = 0; i < size; i++) {
      trie.insert(word);
    }
    expect(trie.getWordCount()).toBe(size);
    let i = 0;
    trie.forEach((current) => {
      expect(current).toBe(word);
      i++;
    });
    expect(i).toBe(size);
  });

  test('Trie insert same word and same prefix word', () => {
    const word1 = 'abc';
    const word2 = 'abcd';
    const size = 10;
    const trie = new Trie();
    for (let i = 0; i < size; i++) {
      trie.insert(word1);
    }
    for (let i = 0; i < size; i++) {
      trie.insert(word2);
    }

    let i = 0;
    trie.forEach((current) => {
      if (i < size) {
        expect(word1).toBe(current);
      } else {
        expect(word2).toBe(current);
      }
      i++;
    });
    expect(trie.getWordCount()).toBe(size * 2);
  });

  test('Trie insert same word and same prefix word', () => {
    const word1 = 'abc';
    const word2 = 'abcd';
    const size = 10;
    const trie = new Trie();
    for (let i = 0; i < size; i++) {
      trie.insert(word1);
      trie.insert(word2);
    }
    let i = 0;
    trie.forEach((current) => {
      if (i < size) {
        expect(word1).toBe(current);
      } else {
        expect(word2).toBe(current);
      }
      i++;
    });
    expect(trie.getWordCount()).toBe(size * 2);
  });
});
