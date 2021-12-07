class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_one_attached :photo
  before_destroy :destroy_notifications

  def notifications
    @notifications ||= Notification.where(params: { post: self })
  end

  def destroy_notifications
    notifications.destroy_all
  end
end
