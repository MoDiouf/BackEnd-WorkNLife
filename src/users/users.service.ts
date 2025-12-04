// users/users.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User ,IdentityVerification } from './users.entity';
import {  CreateDriverVerificationDto, CreateUserDto, DeleteUserDTO } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(IdentityVerification) private verificationRepo: Repository<IdentityVerification>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    console.log("Fetching all users:", users);
    return users;
  }

  async deleteUser(deleteUserDto: DeleteUserDTO): Promise<{ deleted: boolean }> {
    const result = await this.usersRepository.delete({ email: deleteUserDto.email });
    return { deleted: (result.affected ?? 0) > 0 };
  }
  // users/users.service.ts
findById(id: number): Promise<User | null> {
  return this.usersRepository.findOne({ where: { id_user: id } });
}
async requestDriverVerification(
  userId: number,
  dto: CreateDriverVerificationDto,
  file: Express.Multer.File
) {
  const currentUser = await this.usersRepository.findOne({ where: { id_user: userId } });

  if (!currentUser) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  const existingRequest = await this.verificationRepo.findOne({
    where: { 
      user: { id_user: userId },
      role: 'driver',
      status: 'en_attente',
    },
    relations: ['user'],
  });

  if (existingRequest) {
    throw new BadRequestException('Une demande est déjà en attente');
  }

  const verification = this.verificationRepo.create({
    user: currentUser,
    role: 'driver',
    status: 'en_attente',
    document: file.buffer, // fichier en binaire
    document_name: file.originalname,
    document_type: file.mimetype,
  });

  return await this.verificationRepo.save(verification);
}



save(user: User): Promise<User> {
  return this.usersRepository.save(user);
}

    async createUser(dto: CreateUserDto): Promise<User> {
    // 1️⃣ Vérifier si un utilisateur existe déjà avec cet email
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      // 2️⃣ L'utilisateur existe déjà → on ne crée pas
      throw new BadRequestException(
        'Un utilisateur avec cet email existe déjà. Veuillez vous connecter.',
      );
    }

    // 3️⃣ Sinon on crée un nouvel utilisateur
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      full_name: dto.full_name,
      email: dto.email,
      phone: dto.phone || '',
      password: hashedPassword,
      role: 'standard',
      is_verified: false,
    });

    return await this.usersRepository.save(user);
  }

  



async findByEmail(email: string): Promise<User | undefined> {
  const user = await this.usersRepository.findOne({ where: { email } });
  return user === null ? undefined : user;
}

}
