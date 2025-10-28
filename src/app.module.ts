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
import { AuthModule } from './auth/auth.module';
import { PartnerController } from './partner/partner.controller';
import { PartnerModule } from './partner/partner.module';
import { PartnerPortalTemplate, PartnerProfile } from './partner/partner.entity';
import { MenuModule } from './partner/menu/menu.module';
import { Menu } from './partner/menu/menu.entity';
import { Commande } from './partner/commandes/commandes.entity';
import { CarpoolController } from './carpool/carpool.controller';
import { CarpoolModule } from './carpool/carpool.module';
import { Carpool, RideRequest } from './carpool/carpool.entity';
import { CarpoolService } from './carpool/carpool.service';
import { LoisirActivity } from './partner/loisir/loisir.entity';
import { PaymentModule } from './payment/payment.module';
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './reservation/reservation.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',         // ton host MySQL
      port: 3306,                // port MySQL
      username: 'ameth',         // ton utilisateur
      password: 'Sword@rtonl1ne',
      database: 'WorkNLife',
      entities: [User, IdentityVerification, PartnerPortalTemplate, PartnerProfile, Menu, Commande, Carpool, RideRequest,LoisirActivity, Reservation], // ajoute toutes tes entités ici
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'SoloSaasMHD', // mets une vraie clé secrète ici
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    AuthModule,
    PartnerModule,
    MenuModule,
    CarpoolModule,
    PaymentModule,
    ReservationModule,
    
  ],
  controllers: [AppController, UsersController, AuthController, PartnerController, CarpoolController],
  providers: [AppService, AuthService],
})
export class AppModule {}
