class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :omniauthable
  # validates :username, uniqueness: true
  # validates :email, uniqueness: true
  belongs_to :batch, optional: true
  belongs_to :city, optional: true
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :articles, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :conversations, through: :messages, dependent: :destroy
  has_many :notifications, as: :recipient
  has_one_attached :avatar
  extend FriendlyId
  friendly_id :user_username, use: :slugged
  include PgSearch
  pg_search_scope :search_by_name,
                  against: [:first_name, :last_name, :username],
                  using: {
                    tsearch: { prefix: true }
                  }

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create! do |user|
      user_full_name = auth.info.name.split(' ')
      user.provider = auth.provider
      user.username = auth.info.nickname
      user.first_name = user_full_name[0]
      user.last_name = user_full_name.drop(1).join(' ')
      user.uid = auth.uid
      user.email = auth.info.email
      user.image_url = auth.info.image
      user.password = Devise.friendly_token[0, 20]
    end
  end

  def user_username
    username.present? ? username : "#{first_name}-#{last_name}"
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def avatar_key
    avatar.attached? ? avatar.key : 'default-user_rt3abl'
  end

  def chats
    (Conversation.where(sender: self) + Conversation.where(recipient: self)).sort_by(&:updated_at)
  end

  def new_messages
    chats.map { |c| c.messages.where.not(user: self).where.not(read: true) }.flatten.reject(&:blank?)
  end

  def should_generate_new_friendly_id?
    true
  end
end
