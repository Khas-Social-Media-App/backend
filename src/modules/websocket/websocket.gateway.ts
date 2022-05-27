import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@WebSocketGateway()
export class AppGateway {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket & { userId: ObjectId }) {
    try {
      const authToken: string = client.handshake.headers.authorization;

      const jwtPayload = this.jwtService.verify(authToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // eslint-disable-next-line no-param-reassign
      client.userId = jwtPayload._id;
      client.join(`user_room:${client.userId}`);

      // eslint-disable-next-line no-console
      console.log(client.id, 'connected');
    } catch (err) {
      // eslint-disable-line no-unused-vars
      // throw new WsException(err.message); // Leads to crash
    }
  }
}
