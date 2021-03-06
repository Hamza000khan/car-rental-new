import { AuthModule } from '@app/api/auth/auth.module';
import { CarCategoryModule } from '@app/api/car-category/car-category.module';
import { CarModule } from '@app/api/car/car.module';
import { ClientModule } from '@app/api/client/client.module';
import { UserModule } from '@app/api/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CarCategoryModule, UserModule, AuthModule, CarModule, ClientModule],
})
export class ApiModule {}
