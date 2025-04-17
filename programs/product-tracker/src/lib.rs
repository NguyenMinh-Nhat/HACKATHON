use anchor_lang::prelude::*;

declare_id!("D8zZ4Vh5tjfotLQYES8xGtYkaeU5BDrhyFesjHxiFe7E");

#[program]
pub mod product_tracker {
    use super::*;

    pub fn initialize_product(ctx: Context<InitializeProduct>, id: String, name: String, price: u64, seller: Pubkey) -> Result<()> {
        let product = &mut ctx.accounts.product;
        product.id = id;
        product.name = name;
        product.price = price;
        product.seller = seller;
        product.owner = seller;
        product.is_sold = false;
        Ok(())
    }

    pub fn buy_product(ctx: Context<BuyProduct>, amount: u64) -> Result<()> {
        let product = &mut ctx.accounts.product;
        let buyer = &ctx.accounts.buyer;

        require!(!product.is_sold, ProductError::AlreadySold);
        require!(amount >= product.price, ProductError::InsufficientFunds);

        // Transfer SOL from buyer to seller
        **ctx.accounts.seller.to_account_info().try_borrow_mut_lamports()? += product.price;
        **ctx.accounts.buyer.to_account_info().try_borrow_mut_lamports()? -= product.price;

        product.owner = buyer.key();
        product.is_sold = true;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: String)]
pub struct InitializeProduct<'info> {
    #[account(
        init,
        payer = seller,
        space = 8 + 32 + 64 + 8 + 32 + 32 + 1,
        seeds = [b"product", id.as_bytes()],
        bump
    )]
    pub product: Account<'info, Product>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyProduct<'info> {
    #[account(mut)]
    pub product: Account<'info, Product>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub seller: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Product {
    pub id: String,
    pub name: String,
    pub price: u64,
    pub seller: Pubkey,
    pub owner: Pubkey,
    pub is_sold: bool,
}

#[error_code]
pub enum ProductError {
    #[msg("Product is already sold")]
    AlreadySold,
    #[msg("Insufficient funds to buy product")]
    InsufficientFunds,
}