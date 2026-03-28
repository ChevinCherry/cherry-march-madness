from sqlalchemy import UUID, JSON, Integer, BigInteger, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, deferred
import uuid

class Base(DeclarativeBase):
    pass

class DBUser(Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(15), nullable=False)
    password: Mapped[str] = deferred(mapped_column(String(255), nullable=False))
    displayName: Mapped[str] = mapped_column(String(15), nullable=False)
    createdEpoch: Mapped[int] = mapped_column(BigInteger, nullable=False)

class DBRefreshToken(Base):
    __tablename__ = "refresh_token"

    token: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    expiryEpoch: Mapped[int] = mapped_column(BigInteger, nullable=False)
    userId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"))

class DBPool(Base):
    __tablename__ = "pool"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(31), nullable=False)
    creatorId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)
    bracketSourceId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("bracket_source.id"), nullable=False)
    createdEpoch: Mapped[int] = mapped_column(BigInteger, nullable=False)
    startEpoch: Mapped[int] = mapped_column(BigInteger, nullable=False)
    endEpoch: Mapped[int] = mapped_column(BigInteger, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False)
    settings: Mapped[JSON] = mapped_column(JSON)

class DBPick(Base):
    __tablename__ = "pick"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mmlTeamId: Mapped[int] = mapped_column(Integer, nullable=False)
    mmlContestId: Mapped[int] = mapped_column(Integer, nullable=False)
    userId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    poolId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("pool.id"), nullable=False)
    current: Mapped[bool] = mapped_column(Boolean, nullable=False)
    pickEpoch: Mapped[int] = mapped_column(BigInteger, nullable=False)

class DBBracketSource(Base):
    __tablename__ = "bracket_source"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(31), nullable=False)
    fetchUrl: Mapped[str] = mapped_column(Text, nullable=False)
    lastFetch: Mapped[JSON] = mapped_column(JSON, nullable=True)
    lastFetchEpoch: Mapped[int] = mapped_column(BigInteger, nullable=True)

class DBParticipant(Base):
    __tablename__ = "participant"
    
    userId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), primary_key=True)
    poolId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("pool.id"), primary_key=True)
    joinedEpoch: Mapped[int] = mapped_column(BigInteger, nullable=False)
    hidden: Mapped[bool] = mapped_column(Boolean, nullable=False)
    balance: Mapped[int] = mapped_column(Integer, nullable=False)