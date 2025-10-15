import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityVerification, User } from './users/users.entity';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RideController } from './ride/ride.controller';
import { AuthModule } from './auth/auth.module';
import { PartnerController } from './partner/partner.controller';
import { PartnerModule } from './partner/partner.module';
import { PartnerPortalTemplate, PartnerProfile } from './partner/partner.entity';
import { MenuModule } from './partner/menu/menu.module';
import { Menu } from './partner/menu/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',         // ton host MySQL
      port: 3306,                // port MySQL
      username: 'ameth',         // ton utilisateur
      password: 'Sword@rtonl1ne',
      database: 'WorkNLife',     
      entities: [User,IdentityVerification,PartnerPortalTemplate,PartnerProfile,Menu],          
      synchronize: true,         
    }),
    JwtModule.register({
      secret: 'SoloSaasMHD', // mets une vraie clé secrète ici
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    AuthModule,
    PartnerModule,
    MenuModule
  ],
  controllers: [AppController, UsersController, AuthController, RideController, PartnerController],
  providers: [AppService, AuthService],
})
export class AppModule {}
