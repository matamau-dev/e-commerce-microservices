import { ProductAlreadyInWishlistException } from 'src/domain/exceptions/wishlist/product-already-in-wishlist.exception';
import { ProductNotInWishlistException } from 'src/domain/exceptions/wishlist/product-not-in-wishlist.exception';
import { WishlistAlreadySharedException } from 'src/domain/exceptions/wishlist/wishlist-already-shared.exception';

import { WishlistItem } from '../wishlist-item/wishlist-item.entity';
import { WishlistShare } from '../wishlist-share/whislist-share.entity';
import { CannotShareWithOwnerException } from 'src/domain/exceptions/wishlist/cannot-share-with-ower.exception';
import { WishlistShareNotFoundException } from 'src/domain/exceptions/wishlist/whislist-share-not-found.exception';

export class Wishlist {
	private constructor(
		public readonly id: string,
		public readonly userId: string,
		private _isPrivate: boolean,
		private _name: string | undefined,
		private _normalizedName: string | undefined,
		private _isDefault: boolean,
		private _items: WishlistItem[],
		private _shares: WishlistShare[],
		public readonly createdAt: Date,
		private _updatedAt?: Date,
	) {}

	static create(input: {
		userId: string;
		name?: string;
		normalizedName?: string;
		isPrivate?: boolean;
	}): Wishlist {
		return new Wishlist(
			crypto.randomUUID(),
			input.userId,
			input.isPrivate ?? true,
			input.name,
			input.normalizedName
				? Wishlist.normalize(input.normalizedName)
				: undefined,
			false,
			[],
			[],
			new Date(),
		);
	}

	static fromPersistence(input: {
		id: string;
		userId: string;
		isPrivate: boolean;
		name?: string;
		normalizedName?: string;
		isDefault: boolean;
		items: WishlistItem[];
		shares: WishlistShare[];
		createdAt: Date;
		updatedAt?: Date;
	}): Wishlist {
		return new Wishlist(
			input.id,
			input.userId,
			input.isPrivate,
			input.name,
			input.normalizedName
				? Wishlist.normalize(input.normalizedName)
				: undefined,
			input.isDefault,
			input.items,
			input.shares,
			input.createdAt,
			input.updatedAt,
		);
	}

	static normalize(text: string): string {
		return text.trim().toLowerCase().replace(/\s+/g, ' ');
	}

	get isPrivate(): boolean {
		return this._isPrivate;
	}

	get name(): string | undefined {
		return this._name;
	}

	get normalizeName(): string | undefined {
		return this._normalizedName;
	}

	get isDefault(): boolean {
		return this._isDefault;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	get items(): WishlistItem[] {
		return [...this._items];
	}

	get shares(): WishlistShare[] {
		return [...this._shares];
	}

	addItem(productId: string): WishlistItem {
		const exists = this._items.some((i) => i.productId === productId);

		if (exists) throw new ProductAlreadyInWishlistException();

		const item = WishlistItem.create(this.id, productId);
		this._items.push(item);
		this.touch();
		return item;
	}

	removeItem(productId: string): void {
		const index = this._items.findIndex((i) => i.productId === productId);
		if (index === -1) throw new ProductNotInWishlistException();

		this._items.splice(index, 1);
		this.touch();
	}

	shareWith(userId: string): WishlistShare {
		if (userId === this.userId) {
			throw new CannotShareWithOwnerException();
		}

		const alreadyShared = this._shares.some(
			(s) => s.sharedWithUserId === userId,
		);
		if (alreadyShared) throw new WishlistAlreadySharedException();

		const share = WishlistShare.create(this.id, userId);
		this._shares.push(share);
		this.touch();
		return share;
	}

	unshare(userId: string): void {
		const index = this._shares.findIndex(
			(s) => s.sharedWithUserId === userId,
		);
		if (index === -1) throw new WishlistShareNotFoundException();

		this._shares.splice(index, 1);
		this.touch();
	}

	makePrivate(): void {
		if (this._isPrivate) return;

		this._isPrivate = true;
		this._shares = [];
		this.touch();
	}

	makePublic(): void {
		if (!this._isPrivate) return;

		this._isPrivate = false;
		this.touch();
	}

	rename(name: string): void {
		if (this._name === name) return;

		this._name = name;
		this.touch();
	}

	markAsDefault(): void {
		if (this._isDefault) return;

		this._isDefault = true;
		this.touch();
	}

	unmarkAsDefault(): void {
		if (!this._isDefault) return;

		this._isDefault = false;
		this.touch();
	}

	hasProduct(productId: string): boolean {
		return this._items.some((i) => i.productId === productId);
	}

	belongsTo(userId: string): boolean {
		return this.userId === userId;
	}

	private touch(): void {
		this._updatedAt = new Date();
	}
}
