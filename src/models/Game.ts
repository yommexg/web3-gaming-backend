import mongoose, { Document, Schema } from "mongoose";

export interface IGame extends Document {
  title: string;
  creator: mongoose.Types.ObjectId;
  players: mongoose.Types.ObjectId[];
  winner: mongoose.Types.ObjectId;
  maxNumOfPlayers: number;
  image: string;
  privacy: "public" | "private";
  spectatorMode: boolean;
  type:
    | "pocker"
    | "bingo"
    | "agar"
    | "game 04"
    | "game 05"
    | "game 06"
    | "game 07"
    | "game 08"
    | "game 09"
    | "game 10";
  status: "open" | "hosting" | "finished";
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;

  isPlayer(userId: mongoose.Types.ObjectId): boolean;
}

interface GameModel extends mongoose.Model<IGame> {
  getPublicGamesByType(type: IGame["type"]): Promise<IGame[]>;
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true, unique: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    maxNumOfPlayers: { type: Number, required: true, min: 2 },
    image: { type: String },
    privacy: { type: String, enum: ["public", "private"], default: "public" },
    spectatorMode: { type: Boolean, default: false },
    type: {
      type: String,
      enum: [
        "pocker",
        "bingo",
        "agar",
        "game 04",
        "game 05",
        "game 06",
        "game 07",
        "game 08",
        "game 09",
        "game 10",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "hosting", "finished"],
      default: "open",
    },
    startDate: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//
// Virtual: totalPlayers
//
GameSchema.virtual("totalPlayers").get(function (this: IGame) {
  return this.players.length;
});

//
// Pre-save hook: auto-set startDate when status becomes "hosting"
//
GameSchema.pre<IGame>("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "hosting" &&
    !this.startDate
  ) {
    this.startDate = new Date();
  }
  next();
});

//
// Instance method: isPlayer
//
GameSchema.methods.isPlayer = function (
  this: IGame,
  userId: mongoose.Types.ObjectId
): boolean {
  return this.players.some((playerId) => playerId.equals(userId));
};

//
// Static method: getPublicGamesByType
//
GameSchema.statics.getPublicGamesByType = function (
  this: mongoose.Model<IGame>,
  type: IGame["type"]
) {
  return this.find({ type, privacy: "public" }).sort({ createdAt: -1 }).exec();
};

export default mongoose.models.Game ||
  mongoose.model<IGame, GameModel>("Game", GameSchema);
