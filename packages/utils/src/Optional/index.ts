/**
 * 照搬 java
 * stream 相关的没搬
 *
 * @filename packages/utils/src/Optional/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-08-07 15:28:51
 */

import NoSuchElementException from '../customerErrors/NoSuchElementException';
import { Runnable } from '../types';
import { requireNonNull } from '../utils/objectUtils';
import Consumer from './Consumer';
import Predicate from './Predicate';
import Supplier from './Supplier';

class Optional<T> {
  /**
   * Common instance for {@code empty()}.
   */
  private static readonly EMPTY = new Optional<unknown>();

  private readonly value: T;

  private constructor(...values: T[]) {
    if (values.length == 0) {
      this.value = null as T;
    } else {
      this.value = requireNonNull(values[0]);
    }
  }

  public static empty<T>(): Optional<T> {
    return Optional.EMPTY as Optional<T>;
  }

  public static of<T>(value: T) {
    return new Optional<T>(value);
  }

  public static ofNullable<T>(value: T) {
    return value === null ? Optional.empty() : Optional.of(value);
  }

  public get(): T {
    if (this.value == null) {
      throw new NoSuchElementException('No value present');
    }
    return this.value;
  }

  public isPresent() {
    return this.value !== null;
  }

  public isEmpty() {
    return this.value === null;
  }

  public ifPresent(action: Consumer<T>) {
    if (this.isPresent()) {
      action.accept(this.value);
    }
  }

  public ifPresentOrElse(action: Consumer<T>, emptyAction: Runnable) {
    if (this.isPresent()) {
      action.accept(this.value);
    } else {
      emptyAction.run();
    }
  }

  public filter(predicate: Predicate<T>): Optional<T> {
    requireNonNull(predicate);
    if (!this.isPresent()) {
      return this;
    } else {
      return predicate.test(this.value) ? this : Optional.empty();
    }
  }

  public map<R>(mapper: (value: T) => Optional<R>) {
    requireNonNull(mapper);
    if (!this.isPresent()) {
      return Optional.empty();
    } else {
      return Optional.ofNullable(mapper(this.value));
    }
  }

  public flatMap<R>(mapper: (value: T) => Optional<R>) {
    requireNonNull(mapper);
    if (!this.isPresent()) {
      return Optional.empty();
    } else {
      return requireNonNull(mapper(this.value));
    }
  }

  public or<V extends Optional<T>>(supplier: Supplier<V>): Optional<T> {
    requireNonNull(supplier);
    if (this.isPresent()) {
      return this;
    } else {
      return requireNonNull(supplier.get());
    }
  }

  public orElse(other: T): T {
    return this.isPresent() ? this.value : other;
  }

  public orElseGet<V extends T>(supplier: Supplier<V>) {
    return this.isPresent() ? this.value : supplier.get();
  }

  // 签名反着来是为了提示的时候能看到所有签名
  public orElseThrow(exceptionSupplier: Supplier<Error>): T;
  public orElseThrow(): T;
  public orElseThrow(exceptionSupplier?: Supplier<Error>): T {
    if (this.isEmpty()) {
      if (exceptionSupplier) {
        throw exceptionSupplier.get();
      }
      throw new NoSuchElementException('No value present');
    }
    return this.value;
  }

  public equals(obj: any): boolean {
    if (this == obj) {
      return true;
    }

    if (!(obj instanceof Optional)) {
      return false;
    }

    return this.value === obj;
  }
}

export default Optional;
