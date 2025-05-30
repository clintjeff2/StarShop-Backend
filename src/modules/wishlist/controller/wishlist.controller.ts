import { Controller, Post, Delete, Get, Param, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ParsedQs } from 'qs';
import { RequestHandler } from 'express';
import { WishlistService } from '../service/wishlist.service';
import { AuthGuard } from '../common/guard/auth-guard';
import { AuthRequest } from '../common/types/auth-request.type';

@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  static addToWishlist: RequestHandler<{ productId: string }, ParsedQs, Record<string, unknown>>;
  static removeFromWishlist: RequestHandler<
    { productId: string },
    ParsedQs,
    Record<string, unknown>
  >;
  static getWishlist: RequestHandler<Record<string, never>, ParsedQs, Record<string, unknown>>;
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  async addToWishlist(
    @Param('productId') productId: string,
    @Req() req: AuthRequest
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.wishlistService.addToWishlist(userId, productId);
    return { message: 'Product added to wishlist' };
  }

  @Delete(':productId')
  @HttpCode(204)
  async removeFromWishlist(
    @Param('productId') productId: string,
    @Req() req: AuthRequest
  ): Promise<void> {
    const userId = req.user.id;
    await this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get()
  async getWishlist(@Req() req: AuthRequest): Promise<{ wishlist: any[] }> {
    const userId = req.user.id;
    const wishlist = await this.wishlistService.getWishlist(userId);
    return { wishlist };
  }
}
