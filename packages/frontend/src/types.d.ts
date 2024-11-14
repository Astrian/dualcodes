/**
 * Account type
 */
interface Account {
	/**
	 * Account ID
	 * @type {string}
	 * @memberof Account
	 * @example
	 * '79c3e8b3-4854-4dee-854f-d4b40e52bdcb'
	 * @description
	 * A UUIDv4 string that uniquely identifies the account.
	 */
	id: string;

	/**
	 * Account name
	 * @type {string}
	 * @memberof Account
	 * @example
	 * 'John Appleseed'
	 * @description
	 * Discribe for distint different accounts
	 */
	name: string;

	/**
	 * Account website
	 * @type {string}
	 * @memberof Account
	 * @example
	 * 'Apple'
	 * @description
	 * The name of the website the account is for
	 */
	website: string;

	/**
	 * Account 2FA secret
	 * @type {string}
	 * @memberof Account
	 * @example
	 * 'JBSWY3DPEHPK3P...'
	 * @description
	 * The secret key used for generating TOTP codes
	 */
	secret: string;
}

/**
 * Tags
 */
interface Tag {
	/**
	 * Tag ID
	 * @type {string}
	 * @memberof Tag
	 * @example
	 * '79c3e8b3-4854-4dee-854f-d4b40e52bdcb'
	 * @description
	 * A UUIDv4 string that uniquely identifies the tag.
	 */
	id: string;

	/**
	 * Tag name
	 * @type {string}
	 * @memberof Tag
	 * @example
	 * 'Work'
	 * @description
	 * The name of the tag
	 */
	name: string;

	/**
	 * Members
	 * @type {string[]}
	 * @memberof Tag
	 * @example
	 * ['79c3e8b3-4854-4dee-854f-d4b40e52bdcb', '79c3e8b3-4854-4dee-854f-d4b40e52bdcb']
	 * @description
	 * An array of account IDs that are members of the tag
	 */
	members: string[];
}